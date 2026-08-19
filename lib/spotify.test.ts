import { describe, expect, it } from "vitest";
import { toSpotifyEmbedUrl } from "./spotify";

const ID = "6k86Qi0WUAqvZgnIYlDGrC";
const EMBED = `https://open.spotify.com/embed/playlist/${ID}?utm_source=generator`;

describe("toSpotifyEmbedUrl", () => {
  it("converts a plain playlist URL", () => {
    expect(toSpotifyEmbedUrl(`https://open.spotify.com/playlist/${ID}`)).toBe(
      EMBED,
    );
  });

  it("tolerates ?si= and ?utm_source= params", () => {
    expect(
      toSpotifyEmbedUrl(
        `https://open.spotify.com/playlist/${ID}?si=0b57bcc607ef4736&utm_source=generator`,
      ),
    ).toBe(EMBED);
  });

  it("tolerates trailing slashes and surrounding whitespace", () => {
    expect(
      toSpotifyEmbedUrl(`  https://open.spotify.com/playlist/${ID}/  `),
    ).toBe(EMBED);
  });

  it("tolerates /intl-xx/ path segments", () => {
    expect(
      toSpotifyEmbedUrl(`https://open.spotify.com/intl-es/playlist/${ID}`),
    ).toBe(EMBED);
  });

  it("accepts spotify:playlist: URIs", () => {
    expect(toSpotifyEmbedUrl(`spotify:playlist:${ID}`)).toBe(EMBED);
  });

  it("rejects spotify.link short URLs", () => {
    expect(toSpotifyEmbedUrl("https://spotify.link/abc123XYZ")).toBeNull();
  });

  it("rejects album and track URLs", () => {
    expect(
      toSpotifyEmbedUrl(`https://open.spotify.com/album/${ID}`),
    ).toBeNull();
    expect(
      toSpotifyEmbedUrl(`https://open.spotify.com/track/${ID}`),
    ).toBeNull();
  });

  it("rejects non-URL garbage and malformed IDs", () => {
    expect(toSpotifyEmbedUrl("not a url")).toBeNull();
    expect(
      toSpotifyEmbedUrl("https://open.spotify.com/playlist/short"),
    ).toBeNull();
    expect(toSpotifyEmbedUrl("spotify:playlist:!!!invalid!!!")).toBeNull();
  });

  it("rejects empty, null, and undefined input", () => {
    expect(toSpotifyEmbedUrl("")).toBeNull();
    expect(toSpotifyEmbedUrl("   ")).toBeNull();
    expect(toSpotifyEmbedUrl(null)).toBeNull();
    expect(toSpotifyEmbedUrl(undefined)).toBeNull();
  });
});
