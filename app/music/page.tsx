import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PageCountdown from "@/components/PageCountdown";
import FlowerDivider from "@/components/FlowerDivider";
import { flowerByIndex, pageFlowerOffset } from "@/lib/flowers";
import { toSpotifyEmbedUrl } from "@/lib/spotify";
import SongRequestClient from "./SongRequestClient";
import musicJson from "@/content/music.json";

const FL = pageFlowerOffset("/music");

export const metadata: Metadata = { title: "Music" };

// Keystatic omits cleared fields entirely, so everything is optional here and
// every render below carries a fallback — no CMS edit can leave a visible hole.
interface FeaturedSong {
  title?: string | null;
  artist?: string | null;
  note?: string | null;
  url?: string | null;
}
const music = musicJson as {
  kickerIntro?: string | null;
  intro?: string | null;
  spotifyPlaylistUrl?: string | null;
  listenButtonLabel?: string | null;
  embedHeightMobile?: number | null;
  embedHeightDesktop?: number | null;
  kickerFeatured?: string | null;
  featuredHeading?: string | null;
  featuredSongs?: FeaturedSong[] | null;
  kickerRequest?: string | null;
  requestHeading?: string | null;
  requestIntro?: string | null;
  successMessage?: string | null;
  errorMessage?: string | null;
};

// Only https links get rendered — a careless CMS edit can't emit javascript:
// or data: hrefs.
function safeHttpsUrl(raw?: string | null): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

function Kicker({ text }: { text?: string | null }) {
  if (!text) return null;
  return <p className="section-subheading uppercase mb-2">{text}</p>;
}

function embedHeight(value: number | null | undefined, fallback: number): number {
  // Keystatic validates in the UI, but a hand-edited JSON value must not
  // produce invalid CSS and collapse the mat.
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export default function MusicPage() {
  const embedUrl = toSpotifyEmbedUrl(music.spotifyPlaylistUrl);
  // The stored value may be a spotify: URI (valid for the embed but not an
  // https link) — derive the canonical https link from the embed URL so the
  // "Open in Spotify" caption keeps parity with the player.
  const playlistHref =
    safeHttpsUrl(music.spotifyPlaylistUrl) ??
    (embedUrl ? embedUrl.replace("/embed/", "/").split("?")[0] : null);
  const songs = (music.featuredSongs ?? []).filter(
    (s) => (s.title ?? "").trim() || (s.artist ?? "").trim(),
  );

  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg-white)" }}
    >
      <h1 className="page-heading" style={{ color: "var(--color-heading-rose)" }}>
        Music
      </h1>
      <FlowerDivider src={flowerByIndex(FL + 1)} />
      <PageCountdown page="music" />

      <div className="max-w-2xl mx-auto space-y-12 text-center">
        <div>
          <Kicker text={music.kickerIntro} />
          {music.intro && <p style={{ color: "var(--color-body)" }}>{music.intro}</p>}
        </div>

        {/* ── Spotify embed on its mat — the page's visual anchor ── */}
        <div>
          <div
            id="playlist"
            style={
              {
                backgroundColor: "var(--color-bg-white)",
                border: "1px solid var(--color-border)",
                // 16/12px are off-system on purpose: the inner radius must
                // match the Spotify player's own corners or they get clipped.
                borderRadius: 16,
                padding: 14,
                "--embed-h-mobile": `${embedHeight(music.embedHeightMobile, 352)}px`,
                "--embed-h-desktop": `${embedHeight(music.embedHeightDesktop, 480)}px`,
              } as CSSProperties
            }
          >
            <div className="embed-mat-interior flex items-center justify-center">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  width="100%"
                  style={{ borderRadius: 12, border: 0, display: "block", height: "100%" }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Wedding playlist on Spotify"
                />
              ) : (
                <p className="italic px-6" style={{ color: "var(--color-body)" }}>
                  Our playlist is coming soon &mdash; check back!
                </p>
              )}
            </div>
          </div>
          {embedUrl && playlistHref && (
            <div className="mt-4">
              <a
                className="caption-link"
                href={playlistHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {(music.listenButtonLabel || "Open in Spotify").toUpperCase()} {"↗"}
              </a>
            </div>
          )}
        </div>

        <FlowerDivider src={flowerByIndex(FL + 2)} />

        {/* ── Featured songs setlist (hidden entirely when the list is empty) ── */}
        {songs.length > 0 && (
          <>
            <div>
              <Kicker text={music.kickerFeatured} />
              <h2 className="section-heading">
                {music.featuredHeading || "Songs That Matter to Us"}
              </h2>
            </div>

            <div>
              {songs.map((song, i) => {
                const listenHref = safeHttpsUrl(song.url);
                return (
                <div key={`${song.title}-${i}`} className="setlist-row">
                  <span
                    className="flex-shrink-0"
                    style={{ fontSize: 15, color: "var(--color-muted)", width: 28 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className="block"
                      style={{
                        fontFamily: "var(--font-card-heading), var(--font-display), cursive",
                        // rem so the setlist scales with the CMS base font size
                        fontSize: "1.4375rem",
                        lineHeight: 1.2,
                        color: "var(--color-heading-rose)",
                      }}
                    >
                      {song.title}
                    </span>
                    {song.artist && (
                      <span
                        className="block mt-0.5"
                        style={{ fontSize: 15, color: "var(--color-muted)" }}
                      >
                        {song.artist}
                      </span>
                    )}
                    {song.note && (
                      <span
                        className="block italic mt-1.5"
                        style={{ fontSize: 14.5, color: "var(--color-body)" }}
                      >
                        {song.note}
                      </span>
                    )}
                  </span>
                  {listenHref && (
                    <a
                      className="caption-link flex-shrink-0"
                      href={listenHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LISTEN {"↗"}
                    </a>
                  )}
                </div>
                );
              })}
            </div>

            <FlowerDivider src={flowerByIndex(FL + 3)} />
          </>
        )}

        {/* ── Song requests ── */}
        <div>
          <Kicker text={music.kickerRequest} />
          <h2 className="section-heading">
            {music.requestHeading || "Request a Song"}
          </h2>
          {music.requestIntro && (
            <p className="mt-2" style={{ color: "var(--color-body)" }}>
              {music.requestIntro}
            </p>
          )}
        </div>

        <SongRequestClient
          successMessage={
            music.successMessage || "It's on the list — see you on the dance floor."
          }
          errorMessage={
            music.errorMessage || "That didn't go through — give it another try."
          }
        />
      </div>
    </div>
  );
}
