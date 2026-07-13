// ─── RSVP events: single source of truth ─────────────────────────────────
//
// The three head-count events guests RSVP to. Defined ONCE here and imported by
// the Airtable layer, both API routes, and the UI so a rename is a single edit
// (Eng review Issue 3 — DRY). Deliberately NOT derived from content/itinerary.json
// to avoid coupling Airtable field mapping to editorial copy.
//
//   key            → stable program identifier (never shown, never stored)
//   label          → what the guest sees
//   airtableField  → the Guests-table column AND the "Invited Events" option value
//
//        guest roster ──┐
//                       ▼
//   key ⇄ airtableField (mapping used on read + write)
//                       ▲
//        Airtable ──────┘

export type RsvpEventKey = "beachDay" | "welcomeDinner" | "reception";

export interface RsvpEvent {
  key: RsvpEventKey;
  label: string;
  airtableField: string;
  date: string;
}

export const RSVP_EVENTS: readonly RsvpEvent[] = [
  {
    key: "beachDay",
    label: "Beach Day",
    airtableField: "Beach Day",
    date: "Thursday, March 11, 2027",
  },
  {
    key: "welcomeDinner",
    label: "Welcome Dinner",
    airtableField: "Welcome Dinner",
    date: "Friday, March 12, 2027",
  },
  {
    key: "reception",
    label: "The Reception",
    airtableField: "Reception",
    date: "Saturday, March 13, 2027",
  },
] as const;

export const RSVP_EVENT_KEYS: readonly RsvpEventKey[] = RSVP_EVENTS.map(
  (e) => e.key,
);

// Airtable single-select option values for each per-event field, plus the
// "Invited Events" multi-select option values (= the airtableField strings).
export const ATTENDANCE_VALUES = ["No response", "Yes", "No"] as const;
export type Attendance = (typeof ATTENDANCE_VALUES)[number];

export function eventByKey(key: string): RsvpEvent | undefined {
  return RSVP_EVENTS.find((e) => e.key === key);
}

export function eventByField(field: string): RsvpEvent | undefined {
  return RSVP_EVENTS.find((e) => e.airtableField === field);
}

export function isAttendance(value: unknown): value is Attendance {
  return (
    typeof value === "string" &&
    (ATTENDANCE_VALUES as readonly string[]).includes(value)
  );
}
