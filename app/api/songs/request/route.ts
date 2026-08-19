// POST /api/songs/request
// Body: { song: string, artist: string, requestedBy?: string }
// Rate-limited per IP; validation lives in lib/song-request-core (unit-tested).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { parseSongRequest } from "@/lib/song-request-core";
import { createSongRequest } from "@/lib/airtable";
import { notifySongRequest, notifySongRequestFailure } from "@/lib/notify";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const REQUEST_LIMIT = 5; // requests
const REQUEST_WINDOW_MS = 60_000; // per minute per IP

export async function POST(req: Request) {
  const { allowed } = rateLimit(
    `songs:${clientKey(req)}`,
    REQUEST_LIMIT,
    REQUEST_WINDOW_MS,
  );
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please slow down." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON." },
      { status: 400 },
    );
  }

  const parsed = parseSongRequest(body);
  if (!parsed) {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  // The catch covers ONLY the Airtable write, so the failure alert can never
  // mis-attribute a notification problem as a lost request.
  try {
    await createSongRequest(parsed);
  } catch (err) {
    console.error("[songs] request error:", err);
    // Best-effort alert — the couple must learn about a broken table.
    await notifySongRequestFailure((err as Error).message || "unknown error");
    return NextResponse.json(
      { ok: false, error: "Could not save your song request. Please try again." },
      { status: 500 },
    );
  }

  // Best-effort inbox feed — internally guarded, never fails the submit.
  await notifySongRequest(parsed);
  return NextResponse.json({ ok: true });
}
