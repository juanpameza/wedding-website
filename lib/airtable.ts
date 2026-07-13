// ─── Airtable I/O layer (server-only) ─────────────────────────────────────
//
// The only module that talks to Airtable. Pure logic lives in rsvp-core.ts.
//
//   loadAllGuests()  → cached full roster (Next Data Cache, shared across
//                      serverless instances; revalidated on submit + by TTL)
//   searchRoster()   → matched households for the search endpoint
//   submitRsvp()     → validate against fresh data, then batched update-by-id
//
// Reads are cheap (one cached fetch of a small list); writes go straight to
// Airtable and bust the cache tag so a guest's own edits show on re-search.

import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";

import {
  type GuestRecord,
  type HouseholdRoster,
  type SubmissionUpdate,
  groupByHousehold,
  matchHouseholds,
  parseGuest,
  validateSubmission,
  buildPatchRecords,
} from "./rsvp-core";

const API_BASE = "https://api.airtable.com/v0";
const GUESTS_TABLE = "Guests";
const HOUSEHOLDS_TABLE = "Households";
const CACHE_TAG = "rsvp-guests";
const CACHE_TTL_SECONDS = 300;
const BATCH_SIZE = 10; // Airtable hard cap per request

interface AirtableConfig {
  token: string;
  baseId: string;
}

// Fail fast with a clear message instead of a cryptic runtime 500 (Eng review #8).
function getConfig(): AirtableConfig {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) {
    throw new Error(
      "RSVP is not configured: set AIRTABLE_TOKEN and AIRTABLE_BASE_ID. " +
        "See .env.local.example.",
    );
  }
  return { token, baseId };
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

async function listAll(
  table: string,
  config: AirtableConfig,
  fields?: string[],
  view?: string,
): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`${API_BASE}/${config.baseId}/${encodeURIComponent(table)}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    // Records come back in the order they appear in this view. Without it,
    // Airtable does not guarantee your row order.
    if (view) url.searchParams.set("view", view);
    for (const f of fields ?? []) url.searchParams.append("fields[]", f);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${config.token}` },
      // We cache at the loadAllGuests() layer, not per-fetch, so the page
      // through offsets is always live within a single refresh.
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Airtable ${table} list failed (${res.status}): ${body}`);
    }

    const json = (await res.json()) as {
      records: AirtableRecord[];
      offset?: string;
    };
    records.push(...json.records);
    offset = json.offset;
  } while (offset);

  return records;
}

const GUEST_FIELDS = [
  "First Name",
  "Name",
  "Household",
  "Invited Events",
  "Plus One",
  "Dietary Restrictions",
  "Beach Day",
  "Welcome Dinner",
  "Reception",
];

// Guests are listed in this view's order so party members appear on the form in
// the same order as your Airtable rows. Override with AIRTABLE_GUESTS_VIEW if
// your view is named something else.
const GUESTS_VIEW = process.env.AIRTABLE_GUESTS_VIEW ?? "Grid view";

async function listGuests(config: AirtableConfig): Promise<AirtableRecord[]> {
  try {
    return await listAll(GUESTS_TABLE, config, GUEST_FIELDS, GUESTS_VIEW);
  } catch (err) {
    // The view name may not exist in this base. Fall back to an unordered list
    // rather than breaking RSVP entirely.
    console.warn(
      `[rsvp] could not list Guests via view "${GUESTS_VIEW}" — falling back to default order. ` +
        `Set AIRTABLE_GUESTS_VIEW to your view's exact name to control ordering.`,
      err,
    );
    return listAll(GUESTS_TABLE, config, GUEST_FIELDS);
  }
}

async function fetchAllGuests(): Promise<GuestRecord[]> {
  const config = getConfig();

  const [households, guests] = await Promise.all([
    listAll(HOUSEHOLDS_TABLE, config, ["Name"]),
    listGuests(config),
  ]);

  const householdNameById = new Map(
    households.map((h) => [h.id, String(h.fields["Name"] ?? "").trim()]),
  );

  return guests.map((g) =>
    parseGuest(g.id, g.fields, householdNameById),
  );
}

// Shared across serverless instances via Next's Data Cache (Eng review
// Tension 1 — corrected from a per-instance in-memory cache).
const loadAllGuests = unstable_cache(fetchAllGuests, ["rsvp-all-guests"], {
  revalidate: CACHE_TTL_SECONDS,
  tags: [CACHE_TAG],
});

// ─── Public API ───────────────────────────────────────────────────────────

export async function searchRoster(query: string): Promise<HouseholdRoster[]> {
  const guests = await loadAllGuests();
  return matchHouseholds(guests, query);
}

export async function getHouseholdById(
  householdId: string,
): Promise<HouseholdRoster | null> {
  const guests = await loadAllGuests();
  return groupByHousehold(guests).get(householdId) ?? null;
}

export interface SubmitResult {
  ok: boolean;
  updated: number;
  errors: string[];
}

export async function submitRsvp(
  householdId: string,
  updates: SubmissionUpdate[],
  nowIso: string,
): Promise<SubmitResult> {
  const config = getConfig();

  // Validate against fresh authoritative data, not the client's claims.
  const roster = await getHouseholdById(householdId);
  if (!roster) {
    return { ok: false, updated: 0, errors: ["Household not found."] };
  }

  const { errors, sanitized } = validateSubmission(roster, updates);
  if (sanitized.length === 0) {
    return {
      ok: false,
      updated: 0,
      errors: errors.length ? errors : ["Nothing to update."],
    };
  }

  const records = buildPatchRecords(sanitized, nowIso);

  // Batched, update-by-id (idempotent). All-or-report: collect per-batch
  // outcomes so a partial failure on a large household is visible (Eng #6/#7).
  let updated = 0;
  const writeErrors: string[] = [];

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    const res = await fetch(
      `${API_BASE}/${config.baseId}/${encodeURIComponent(GUESTS_TABLE)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: chunk, typecast: false }),
      },
    );

    if (res.ok) {
      updated += chunk.length;
    } else {
      const body = await res.text().catch(() => "");
      writeErrors.push(`Batch ${i / BATCH_SIZE + 1} failed (${res.status}): ${body}`);
    }
  }

  // Bust the cache so the guest sees their own answers on re-search.
  if (updated > 0) revalidateTag(CACHE_TAG);

  return {
    ok: writeErrors.length === 0,
    updated,
    errors: [...errors, ...writeErrors],
  };
}
