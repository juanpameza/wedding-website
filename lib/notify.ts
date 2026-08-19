// ─── Submit notifications (server-only) ───────────────────────────────────
//
// Emails the couple when a household submits an RSVP (Eng review Tension 2 —
// audit/grief mitigation) and when a guest requests a song (Music page eng
// review 9A — the song-request email doubles as failure detection: if the
// Airtable table drifts, the failure alert is the only signal the couple gets).
// Uses Resend over plain fetch (no new dependency). If env isn't set it just
// logs, so the feature works before you wire email up. Never throws into the
// request path — notification failure must not fail a submit.

import "server-only";
import { SONG_REQUESTS_TABLE } from "./song-request-core";

interface NotifyInput {
  householdName: string;
  updatedCount: number;
  whenIso: string;
}

// Shared best-effort sender: logs when unconfigured, never throws.
async function sendNotification(
  tag: string,
  subject: string,
  text: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RSVP_NOTIFY_EMAIL;
  const from = process.env.RSVP_NOTIFY_FROM ?? "rsvp@resend.dev";

  if (!apiKey || !to) {
    console.log(`[${tag}] ${text} (email not configured)`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
    if (!res.ok) {
      console.error(`[${tag}] notify failed (${res.status})`);
    }
  } catch (err) {
    console.error(`[${tag}] notify error:`, err);
  }
}

export async function notifyRsvp(input: NotifyInput): Promise<void> {
  const summary = `RSVP submitted: ${input.householdName} (${input.updatedCount} guest${input.updatedCount === 1 ? "" : "s"}) at ${input.whenIso}`;
  await sendNotification(
    "rsvp",
    `Wedding RSVP — ${input.householdName}`,
    summary,
  );
}

export async function notifySongRequest(input: {
  song: string;
  artist: string;
  requestedBy: string;
}): Promise<void> {
  const who = input.requestedBy || "someone (no name given)";
  await sendNotification(
    "songs",
    `Song request — ${input.song}`,
    `Song request from ${who}: "${input.song}" by ${input.artist}`,
  );
}

export async function notifySongRequestFailure(detail: string): Promise<void> {
  await sendNotification(
    "songs",
    "Song request FAILED to save",
    `A guest's song request could not be written to Airtable — check that the "${SONG_REQUESTS_TABLE}" table exists with fields Song, Artist, Requested By. Detail: ${detail}`,
  );
}
