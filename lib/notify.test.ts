import { afterEach, describe, expect, it, vi } from "vitest";
import {
  notifyRsvp,
  notifySongRequest,
  notifySongRequestFailure,
} from "./notify";

// The route awaits these on the request path — the "never throws" invariant is
// load-bearing: a throw after a successful Airtable write would 500 a saved
// request and invite a duplicate submission.
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function configure() {
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("RSVP_NOTIFY_EMAIL", "couple@example.com");
}

describe("notifySongRequest", () => {
  it("never throws when the email API is down", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    await expect(
      notifySongRequest({ song: "A", artist: "B", requestedBy: "" }),
    ).resolves.toBeUndefined();
  });

  it("never throws on a non-ok response", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(
      notifySongRequest({ song: "A", artist: "B", requestedBy: "Tía Rosa" }),
    ).resolves.toBeUndefined();
  });

  it("skips the network entirely when email env is unconfigured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("RSVP_NOTIFY_EMAIL", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await notifySongRequest({ song: "A", artist: "B", requestedBy: "" });
    await notifySongRequestFailure("detail");
    await notifyRsvp({ householdName: "H", updatedCount: 1, whenIso: "now" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the guest's fields to the configured recipient", async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    await notifySongRequest({ song: "Sopa De Caracol", artist: "Banda Blanca", requestedBy: "" });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.to).toBe("couple@example.com");
    expect(body.subject).toContain("Sopa De Caracol");
    expect(body.text).toContain("Banda Blanca");
  });
});

describe("notifySongRequestFailure", () => {
  it("names the Airtable table in the alert", async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    await notifySongRequestFailure("boom");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toContain("Song Requests");
    expect(body.text).toContain("boom");
  });
});
