import { test, expect } from "@playwright/test";
import musicJson from "../content/music.json";

// All flows run without Airtable or Spotify availability: the embed test
// asserts the iframe element/attribute only (never waits on spotify.com),
// and the submit test stubs the API route — no real writes.
//
// Expectations derive from content/music.json (mirroring the page's fallback
// chain) so routine Keystatic content edits can't break the suite.
const SONGS = (musicJson.featuredSongs ?? []).filter(
  (s) => (s.title ?? "").trim() || (s.artist ?? "").trim(),
);
const SUCCESS_MESSAGE =
  musicJson.successMessage || "It's on the list — see you on the dance floor.";
const ERROR_MESSAGE =
  musicJson.errorMessage || "That didn't go through — give it another try.";

test("music page renders: nav, embed iframe, setlist, form", async ({
  page,
}) => {
  await page.goto("/music");

  await expect(
    page.getByRole("heading", { name: "Music", exact: true }),
  ).toBeVisible();
  // :not(.nav-link-mobile) — the hidden mobile menu carries a second active link
  await expect(
    page.locator("nav a.nav-link.active:not(.nav-link-mobile)"),
  ).toHaveText("Music");

  const iframe = page.locator('iframe[title="Wedding playlist on Spotify"]');
  await expect(iframe).toHaveAttribute(
    "src",
    /open\.spotify\.com\/embed\/playlist\//,
  );

  await expect(page.locator(".setlist-row")).toHaveCount(SONGS.length);
  await expect(page.getByLabel("Song", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Artist", { exact: true })).toBeVisible();
});

test("empty submit shows inline error without calling the API", async ({
  page,
}) => {
  const apiCalls: string[] = [];
  // Scoped to our endpoint — fonts, HMR, and the Spotify iframe legitimately
  // make other requests.
  page.on("request", (req) => {
    if (req.url().includes("/api/songs/request")) apiCalls.push(req.url());
  });

  await page.goto("/music");
  await page.getByRole("button", { name: "Send it to the DJ" }).click();

  await expect(
    page.getByText("Please tell us the song and who sings it."),
  ).toBeVisible();
  expect(apiCalls).toHaveLength(0);
});

test("stubbed submit shows the success state with three follow-up links", async ({
  page,
}) => {
  await page.route("**/api/songs/request", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }),
  );

  await page.goto("/music");
  await page.getByLabel("Song", { exact: true }).fill("La Rebelión");
  await page.getByLabel("Artist", { exact: true }).fill("Joe Arroyo");
  await page.getByRole("button", { name: "Send it to the DJ" }).click();

  await expect(page.getByText(SUCCESS_MESSAGE)).toBeVisible();
  await expect(page.getByRole("link", { name: /press play/ })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Request another song" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Back to home/ })).toBeVisible();

  // reset(): "Request another song" returns to a blank form.
  await page.getByRole("button", { name: "Request another song" }).click();
  await expect(page.getByLabel("Song", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Artist", { exact: true })).toHaveValue("");
});

test("stubbed server failure shows the CMS error message and keeps the form", async ({
  page,
}) => {
  await page.route("**/api/songs/request", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "Could not save." }),
    }),
  );

  await page.goto("/music");
  await page.getByLabel("Song", { exact: true }).fill("La Rebelión");
  await page.getByLabel("Artist", { exact: true }).fill("Joe Arroyo");
  await page.getByRole("button", { name: "Send it to the DJ" }).click();

  // errorMessage from content/music.json, threaded through page.tsx as a prop.
  await expect(page.getByText(ERROR_MESSAGE)).toBeVisible();
  // The form survives the failure: values retained, button re-enabled.
  await expect(page.getByLabel("Song", { exact: true })).toHaveValue(
    "La Rebelión",
  );
  await expect(
    page.getByRole("button", { name: "Send it to the DJ" }),
  ).toBeEnabled();
});

// The real route (no stubs) — the 400 paths return before Airtable is touched,
// so they run with zero credentials. A unique per-run forwarded IP keeps the
// per-IP rate limiter's bucket fresh across rapid re-runs of the suite.
test.describe("real route validation", () => {
  const forwardedFor = () => ({
    "x-forwarded-for": `10.77.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
  });

  test("rejects a malformed body with 400", async ({ request }) => {
    const res = await request.post("/api/songs/request", {
      headers: forwardedFor(),
      data: { song: "   ", artist: "" },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).ok).toBe(false);
  });

  test("rejects invalid JSON with 400", async ({ request }) => {
    const res = await request.post("/api/songs/request", {
      headers: { "Content-Type": "application/json", ...forwardedFor() },
      data: "not json",
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).ok).toBe(false);
  });
});
