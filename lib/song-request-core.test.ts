import { describe, expect, it } from "vitest";
import { parseSongRequest, SONG_FIELD_MAX } from "./song-request-core";

describe("parseSongRequest", () => {
  it("accepts a valid request and trims fields", () => {
    expect(
      parseSongRequest({
        song: "  Pedro Navaja ",
        artist: " Rubén Blades ",
        requestedBy: " Tía Rosa ",
      }),
    ).toEqual({
      song: "Pedro Navaja",
      artist: "Rubén Blades",
      requestedBy: "Tía Rosa",
    });
  });

  it("accepts an absent or empty requestedBy", () => {
    expect(parseSongRequest({ song: "A", artist: "B" })).toEqual({
      song: "A",
      artist: "B",
      requestedBy: "",
    });
    expect(
      parseSongRequest({ song: "A", artist: "B", requestedBy: "" }),
    ).toEqual({ song: "A", artist: "B", requestedBy: "" });
  });

  it("rejects missing or non-string song/artist", () => {
    expect(parseSongRequest({ artist: "B" })).toBeNull();
    expect(parseSongRequest({ song: "A" })).toBeNull();
    expect(parseSongRequest({ song: 1, artist: "B" })).toBeNull();
    expect(parseSongRequest({ song: "A", artist: ["B"] })).toBeNull();
  });

  it("rejects a non-string requestedBy", () => {
    expect(
      parseSongRequest({ song: "A", artist: "B", requestedBy: 42 }),
    ).toBeNull();
  });

  it("rejects whitespace-only song or artist", () => {
    expect(parseSongRequest({ song: "   ", artist: "B" })).toBeNull();
    expect(parseSongRequest({ song: "A", artist: "\t" })).toBeNull();
  });

  it("accepts exactly 200 chars and rejects 201", () => {
    const max = "x".repeat(SONG_FIELD_MAX);
    const over = "x".repeat(SONG_FIELD_MAX + 1);
    expect(parseSongRequest({ song: max, artist: "B" })).not.toBeNull();
    expect(parseSongRequest({ song: over, artist: "B" })).toBeNull();
    expect(parseSongRequest({ song: "A", artist: over })).toBeNull();
    expect(
      parseSongRequest({ song: "A", artist: "B", requestedBy: over }),
    ).toBeNull();
  });

  it("replaces control characters with spaces and collapses runs", () => {
    expect(
      parseSongRequest({
        song: "Line1\nLine2\tTabbed",
        artist: "A\r\nB",
        requestedBy: "C" + String.fromCharCode(0) + "D",
      }),
    ).toEqual({
      song: "Line1 Line2 Tabbed",
      artist: "A B",
      requestedBy: "C D",
    });
  });

  it("rejects input that is only control characters", () => {
    expect(parseSongRequest({ song: "\n\r\t", artist: "B" })).toBeNull();
  });

  it("rejects non-object bodies", () => {
    expect(parseSongRequest(null)).toBeNull();
    expect(parseSongRequest(undefined)).toBeNull();
    expect(parseSongRequest("song")).toBeNull();
    expect(parseSongRequest(42)).toBeNull();
  });
});
