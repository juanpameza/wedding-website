import { describe, expect, it } from "vitest";
import { shouldShowCountdown } from "./site-style";

// Regression guard: this PR re-keys the RSVP page's countdown from the FAQs
// checkbox to its own "rsvp" key and adds "music" — these tests pin the
// visibility semantics both changes rely on.
describe("shouldShowCountdown", () => {
  it("follows an explicit true/false for a page", () => {
    const site = { countdownVisibility: { music: true, rsvp: false } };
    expect(shouldShowCountdown(site, "music")).toBe(true);
    expect(shouldShowCountdown(site, "rsvp")).toBe(false);
  });

  it("defaults to hidden when the page key is missing from the visibility map", () => {
    const site = { countdownVisibility: { home: true } };
    expect(shouldShowCountdown(site, "music")).toBe(false);
    expect(shouldShowCountdown(site, "rsvp")).toBe(false);
  });

  it("shows only on home when no visibility map exists at all", () => {
    expect(shouldShowCountdown({}, "home")).toBe(true);
    expect(shouldShowCountdown({}, "music")).toBe(false);
    expect(shouldShowCountdown({ countdownVisibility: null }, "home")).toBe(
      true,
    );
  });

  it("keeps rsvp and faqs independent (the re-keyed bug)", () => {
    const site = { countdownVisibility: { faqs: true, rsvp: false } };
    expect(shouldShowCountdown(site, "faqs")).toBe(true);
    expect(shouldShowCountdown(site, "rsvp")).toBe(false);
  });
});
