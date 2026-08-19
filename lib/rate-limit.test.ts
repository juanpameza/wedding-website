import { describe, expect, it } from "vitest";
import { rateLimit, clientKey } from "./rate-limit";

// The module-level bucket Map persists across tests in this file — every test
// uses its own unique key so windows can't bleed into each other.
describe("rateLimit", () => {
  it("allows up to the limit, blocks the excess, and resets after the window", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) {
      expect(rateLimit("w1", 5, 60_000, t0 + i).allowed).toBe(true);
    }
    expect(rateLimit("w1", 5, 60_000, t0 + 10).allowed).toBe(false);
    expect(rateLimit("w1", 5, 60_000, t0 + 59_999).allowed).toBe(false);
    expect(rateLimit("w1", 5, 60_000, t0 + 60_000).allowed).toBe(true);
  });

  it("counts remaining requests down to zero", () => {
    expect(rateLimit("w2", 2, 60_000, 0).remaining).toBe(1);
    expect(rateLimit("w2", 2, 60_000, 1).remaining).toBe(0);
    expect(rateLimit("w2", 2, 60_000, 2).remaining).toBe(0);
  });

  it("tracks keys independently", () => {
    for (let i = 0; i < 5; i++) rateLimit("w3a", 5, 60_000, 0);
    expect(rateLimit("w3a", 5, 60_000, 1).allowed).toBe(false);
    expect(rateLimit("w3b", 5, 60_000, 1).allowed).toBe(true);
  });
});

describe("clientKey", () => {
  it("uses the first x-forwarded-for hop, trimmed", () => {
    const req = new Request("http://x", {
      headers: { "x-forwarded-for": " 1.2.3.4 , 10.0.0.1" },
    });
    expect(clientKey(req)).toBe("1.2.3.4");
  });

  it("falls back to 'unknown' without the header", () => {
    expect(clientKey(new Request("http://x"))).toBe("unknown");
  });
});
