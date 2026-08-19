// ─── Song request validation (pure logic) ─────────────────────────────────
//
// Mirrors the rsvp-core split: the route handler stays a thin shell and every
// validation branch lives here where the vitest harness (lib/**) can reach it.

export const SONG_FIELD_MAX = 200;

// Single source of truth for the Airtable table name — the I/O layer and the
// failure-alert email both reference it, so a rename can't drift.
export const SONG_REQUESTS_TABLE = "Song Requests";

export interface SongRequest {
  song: string;
  artist: string;
  requestedBy: string;
}

// Guest input flows into notification emails — replace layout-shaping
// characters (C0/C1 controls incl. NEL, DEL, and bidi override marks) with
// spaces and collapse runs, so a submission can't spoof extra lines or
// reorder text in the couple's inbox.
function isLayoutShaping(code: number): boolean {
  if (code < 32 || code === 127 || code === 133) return true; // C0, DEL, NEL
  if (code === 0x200e || code === 0x200f) return true; // LRM / RLM
  if (code >= 0x202a && code <= 0x202e) return true; // bidi embeds/overrides
  if (code >= 0x2066 && code <= 0x2069) return true; // bidi isolates
  return false;
}

function clean(value: string): string {
  let out = "";
  for (const ch of value) {
    out += isLayoutShaping(ch.charCodeAt(0)) ? " " : ch;
  }
  return out.replace(/\s+/g, " ").trim();
}

export function parseSongRequest(body: unknown): SongRequest | null {
  if (!body || typeof body !== "object") return null;

  const { song, artist, requestedBy } = body as Record<string, unknown>;
  if (typeof song !== "string" || typeof artist !== "string") return null;
  if (requestedBy !== undefined && typeof requestedBy !== "string") return null;

  const cleanSong = clean(song);
  const cleanArtist = clean(artist);
  const cleanRequestedBy = clean(requestedBy ?? "");

  if (!cleanSong || !cleanArtist) return null;
  if (
    cleanSong.length > SONG_FIELD_MAX ||
    cleanArtist.length > SONG_FIELD_MAX ||
    cleanRequestedBy.length > SONG_FIELD_MAX
  ) {
    return null;
  }

  return {
    song: cleanSong,
    artist: cleanArtist,
    requestedBy: cleanRequestedBy,
  };
}
