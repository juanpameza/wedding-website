// GET /api/rsvp/search?q=<name>
// Returns the full roster of each household whose member names match. Served
// from the cached guest list (no per-keystroke Airtable read). Rate-limited.

export const runtime = "nodejs"; // Airtable layer is not edge-safe
export const dynamic = "force-dynamic"; // never statically cache search

import { NextResponse } from "next/server";
import { searchRoster } from "@/lib/airtable";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const SEARCH_LIMIT = 30; // requests
const SEARCH_WINDOW_MS = 60_000; // per minute per IP

export async function GET(req: Request) {
  const { allowed } = rateLimit(
    `search:${clientKey(req)}`,
    SEARCH_LIMIT,
    SEARCH_WINDOW_MS,
  );
  if (!allowed) {
    return NextResponse.json(
      { households: [], error: "Too many requests. Please slow down." },
      { status: 429 },
    );
  }

  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ households: [] });
  }

  try {
    const households = await searchRoster(q);
    return NextResponse.json({ households });
  } catch (err) {
    console.error("[rsvp] search error:", err);
    return NextResponse.json(
      { households: [], error: "Search is temporarily unavailable." },
      { status: 500 },
    );
  }
}
