// POST /api/rsvp/submit
// Body: { householdId: string, updates: [{ guestId, responses: {beachDay?, welcomeDinner?, reception?} }] }
// Server re-validates ownership + invitation against fresh data before writing.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { submitRsvp } from "@/lib/airtable";
import { notifyRsvp } from "@/lib/notify";
import { getHouseholdById } from "@/lib/airtable";
import type { SubmissionUpdate } from "@/lib/rsvp-core";

interface SubmitBody {
  householdId?: unknown;
  updates?: unknown;
}

function parseBody(body: SubmitBody): {
  householdId: string;
  updates: SubmissionUpdate[];
} | null {
  if (typeof body.householdId !== "string" || !body.householdId) return null;
  if (!Array.isArray(body.updates)) return null;

  const updates: SubmissionUpdate[] = [];
  for (const raw of body.updates) {
    if (
      !raw ||
      typeof raw !== "object" ||
      typeof (raw as any).guestId !== "string" ||
      typeof (raw as any).responses !== "object" ||
      (raw as any).responses === null
    ) {
      return null;
    }
    updates.push({
      guestId: (raw as any).guestId,
      responses: (raw as any).responses,
    });
  }
  return { householdId: body.householdId, updates };
}

export async function POST(req: Request) {
  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = parseBody(body);
  if (!parsed) {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const nowIso = new Date().toISOString();

  try {
    const result = await submitRsvp(parsed.householdId, parsed.updates, nowIso);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    // Best-effort notification — never fails the submit.
    const roster = await getHouseholdById(parsed.householdId);
    await notifyRsvp({
      householdName: roster?.householdName ?? "Unknown household",
      updatedCount: result.updated,
      whenIso: nowIso,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[rsvp] submit error:", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your RSVP. Please try again." },
      { status: 500 },
    );
  }
}
