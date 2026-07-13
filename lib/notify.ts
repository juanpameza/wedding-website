// ─── Submit notification (server-only) ────────────────────────────────────
//
// Emails the couple when a household submits an RSVP (Eng review Tension 2 —
// audit/grief mitigation: you get a record of every change as it happens).
// Uses Resend over plain fetch (no new dependency). If env isn't set it just
// logs, so the feature works before you wire email up. Never throws into the
// request path — notification failure must not fail a submit.

import "server-only";

interface NotifyInput {
  householdName: string;
  updatedCount: number;
  whenIso: string;
}

export async function notifyRsvp(input: NotifyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RSVP_NOTIFY_EMAIL;
  const from = process.env.RSVP_NOTIFY_FROM ?? "rsvp@resend.dev";

  const summary = `RSVP submitted: ${input.householdName} (${input.updatedCount} guest${input.updatedCount === 1 ? "" : "s"}) at ${input.whenIso}`;

  if (!apiKey || !to) {
    console.log(`[rsvp] ${summary} (email not configured)`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Wedding RSVP — ${input.householdName}`,
        text: summary,
      }),
    });
    if (!res.ok) {
      console.error(`[rsvp] notify failed (${res.status})`);
    }
  } catch (err) {
    console.error("[rsvp] notify error:", err);
  }
}
