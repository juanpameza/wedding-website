// ─── Spotify playlist URL → embed URL ─────────────────────────────────────
//
// Accepts the two shapes a playlist reference realistically arrives in:
//   https://open.spotify.com/playlist/{id}         (browser address bar; may
//     carry ?si=/?utm_source= params, /intl-xx/ segments, trailing slashes)
//   spotify:playlist:{id}                          (desktop "Copy Spotify URI")
// Rejects everything else — including spotify.link short URLs, which can't be
// resolved without a network hop (the Keystatic field description warns
// editors away from them).

const PLAYLIST_ID = /^[A-Za-z0-9]{16,34}$/;

function embedUrl(id: string): string {
  return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator`;
}

export function toSpotifyEmbedUrl(
  input: string | null | undefined,
): string | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;

  const uriMatch = raw.match(/^spotify:playlist:([A-Za-z0-9]+)$/);
  if (uriMatch) {
    return PLAYLIST_ID.test(uriMatch[1]) ? embedUrl(uriMatch[1]) : null;
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.hostname !== "open.spotify.com") return null;

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0]?.startsWith("intl-")) segments.shift();
  if (segments.length !== 2 || segments[0] !== "playlist") return null;

  return PLAYLIST_ID.test(segments[1]) ? embedUrl(segments[1]) : null;
}
