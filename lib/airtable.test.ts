import { afterEach, describe, expect, it, vi } from "vitest";
import { createSongRequest } from "./airtable";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function configure() {
  vi.stubEnv("AIRTABLE_TOKEN", "test-token");
  vi.stubEnv("AIRTABLE_BASE_ID", "appTEST");
}

describe("createSongRequest", () => {
  it("posts to the Song Requests table and omits Requested By when empty", async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await createSongRequest({ song: "A", artist: "B", requestedBy: "" });

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/appTEST/Song%20Requests");
    const body = JSON.parse(init.body);
    expect(body).toEqual({
      records: [{ fields: { Song: "A", Artist: "B" } }],
      typecast: false,
    });
  });

  it("includes Requested By when the guest gave a name", async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await createSongRequest({ song: "A", artist: "B", requestedBy: "Tía Rosa" });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.records[0].fields["Requested By"]).toBe("Tía Rosa");
  });

  it("throws with the status when Airtable rejects the write", async () => {
    configure();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => "denied" }),
    );

    await expect(
      createSongRequest({ song: "A", artist: "B", requestedBy: "" }),
    ).rejects.toThrow(/403/);
  });

  it("throws a clear config error when env is missing", async () => {
    vi.stubEnv("AIRTABLE_TOKEN", "");
    vi.stubEnv("AIRTABLE_BASE_ID", "");
    await expect(
      createSongRequest({ song: "A", artist: "B", requestedBy: "" }),
    ).rejects.toThrow(/AIRTABLE_TOKEN/);
  });
});
