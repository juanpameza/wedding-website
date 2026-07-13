// ─── RSVP pure logic (no I/O) ─────────────────────────────────────────────
//
// All matching/validation/parsing lives here so it can be unit-tested without
// touching Airtable or the network (Eng review Issue 4). lib/airtable.ts does
// the I/O and delegates the thinking to these functions.
//
//   Airtable raw record ──parseGuest──▶ GuestRecord
//   GuestRecord[] ──matchHouseholds──▶ HouseholdRoster[]   (search)
//   roster + client updates ──validateSubmission──▶ sanitized updates (write)

import {
  type Attendance,
  type RsvpEventKey,
  RSVP_EVENTS,
  eventByField,
  eventByKey,
  isAttendance,
} from "./rsvp-events";

export interface GuestRecord {
  id: string;
  firstName: string;
  name: string;
  householdId: string | null;
  householdName: string | null;
  invitedEvents: RsvpEventKey[];
  responses: Record<RsvpEventKey, Attendance>;
}

export interface HouseholdRoster {
  householdId: string;
  householdName: string;
  members: GuestRecord[];
}

export interface SubmissionUpdate {
  guestId: string;
  responses: Partial<Record<RsvpEventKey, Attendance>>;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  sanitized: SubmissionUpdate[];
}

const SEARCH_MIN_CHARS = 2;
const DEFAULT_HOUSEHOLD_LIMIT = 5;

function emptyResponses(): Record<RsvpEventKey, Attendance> {
  return RSVP_EVENTS.reduce(
    (acc, e) => {
      acc[e.key] = "No response";
      return acc;
    },
    {} as Record<RsvpEventKey, Attendance>,
  );
}

// Parse one raw Airtable Guests record into a normalized GuestRecord.
// `householdNameById` resolves the linked Household record id → its name.
export function parseGuest(
  recordId: string,
  fields: Record<string, unknown>,
  householdNameById: Map<string, string>,
): GuestRecord {
  const householdLink = Array.isArray(fields["Household"])
    ? (fields["Household"] as string[])
    : [];
  const householdId = householdLink[0] ?? null;

  const invitedRaw = Array.isArray(fields["Invited Events"])
    ? (fields["Invited Events"] as string[])
    : [];
  const invitedEvents = invitedRaw
    .map((field) => eventByField(field)?.key)
    .filter((k): k is RsvpEventKey => Boolean(k));

  const responses = emptyResponses();
  for (const event of RSVP_EVENTS) {
    const raw = fields[event.airtableField];
    if (isAttendance(raw)) responses[event.key] = raw;
  }

  return {
    id: recordId,
    firstName: String(fields["First Name"] ?? fields["Name"] ?? "").trim(),
    name: String(fields["Name"] ?? "").trim(),
    householdId,
    householdName: householdId
      ? householdNameById.get(householdId) ?? null
      : null,
    invitedEvents,
    responses,
  };
}

// Group a flat guest list by household. Orphan guests (no Household link) become
// a single-person roster keyed by `guest:<id>` so they can still RSVP.
export function groupByHousehold(
  guests: GuestRecord[],
): Map<string, HouseholdRoster> {
  const map = new Map<string, HouseholdRoster>();
  for (const guest of guests) {
    const id = guest.householdId ?? `guest:${guest.id}`;
    const name =
      guest.householdName ?? guest.name ?? guest.firstName ?? "Your party";
    if (!map.has(id)) {
      map.set(id, { householdId: id, householdName: name, members: [] });
    }
    map.get(id)!.members.push(guest);
  }
  return map;
}

// Find households whose members match the query by name (case-insensitive
// substring). Returns the FULL roster of each matched household, capped.
export function matchHouseholds(
  guests: GuestRecord[],
  query: string,
  limit: number = DEFAULT_HOUSEHOLD_LIMIT,
): HouseholdRoster[] {
  const q = query.trim().toLowerCase();
  if (q.length < SEARCH_MIN_CHARS) return [];

  const byHousehold = groupByHousehold(guests);
  const matchedIds = new Set<string>();

  for (const guest of guests) {
    const hay = `${guest.name} ${guest.firstName}`.toLowerCase();
    if (hay.includes(q)) {
      matchedIds.add(guest.householdId ?? `guest:${guest.id}`);
    }
    if (matchedIds.size >= limit) break;
  }

  return Array.from(matchedIds)
    .map((id) => byHousehold.get(id))
    .filter((r): r is HouseholdRoster => Boolean(r))
    .slice(0, limit);
}

// Validate client-submitted updates against the authoritative roster.
// Enforces: (1) ownership — guest must be in this household; (2) invitation —
// the event must be in the guest's invitedEvents; (3) valid attendance value.
// Returns only the updates that pass all three (sanitized), plus any errors.
export function validateSubmission(
  roster: HouseholdRoster,
  updates: SubmissionUpdate[],
): ValidationResult {
  const errors: string[] = [];
  const memberById = new Map(roster.members.map((m) => [m.id, m]));
  const sanitized: SubmissionUpdate[] = [];

  for (const update of updates) {
    const member = memberById.get(update.guestId);
    if (!member) {
      errors.push(`Guest ${update.guestId} is not in this household.`);
      continue;
    }

    const responses: Partial<Record<RsvpEventKey, Attendance>> = {};
    for (const [rawKey, value] of Object.entries(update.responses ?? {})) {
      const event = eventByKey(rawKey);
      if (!event) {
        errors.push(`Unknown event "${rawKey}".`);
        continue;
      }
      if (!member.invitedEvents.includes(event.key)) {
        errors.push(`${member.name} is not invited to ${event.label}.`);
        continue;
      }
      if (!isAttendance(value)) {
        errors.push(`Invalid response "${String(value)}" for ${event.label}.`);
        continue;
      }
      responses[event.key] = value;
    }

    if (Object.keys(responses).length > 0) {
      sanitized.push({ guestId: update.guestId, responses });
    }
  }

  return { ok: errors.length === 0, errors, sanitized };
}

// Turn sanitized updates into Airtable PATCH records (event key → field name,
// plus audit stamps). Caller batches these in chunks of 10.
export function buildPatchRecords(
  updates: SubmissionUpdate[],
  nowIso: string,
): Array<{ id: string; fields: Record<string, string> }> {
  return updates.map((update) => {
    const fields: Record<string, string> = {
      "Responded At": nowIso,
      "Last Modified": nowIso,
    };
    for (const [key, value] of Object.entries(update.responses)) {
      const event = eventByKey(key);
      if (event && value) fields[event.airtableField] = value;
    }
    return { id: update.guestId, fields };
  });
}
