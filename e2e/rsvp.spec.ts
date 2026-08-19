import { test, expect } from "@playwright/test";
import type { HouseholdRoster } from "../lib/rsvp-core";

// Smoke: the page renders and the search box is present (no Airtable needed).
test("rsvp page renders with a search box", async ({ page }) => {
  await page.goto("/rsvp");
  await expect(page.getByRole("heading", { name: "RSVP" })).toBeVisible();
  await expect(page.getByLabel("Enter your name")).toBeVisible();
});

// Full journey with stubbed API routes — runs with zero Airtable credentials.
// Fixture shapes mirror lib/rsvp-core's HouseholdRoster and the submit route's
// response. This also guards the shared TextField extraction: the dietary
// field in the form step renders through components/TextField.
// Typed against the real API contract so fixture drift fails the typecheck
// instead of keeping a green e2e while production breaks.
const HOUSEHOLD: HouseholdRoster = {
  householdId: "hh-e2e",
  householdName: "The Test Family",
  members: [
    {
      id: "guest-e2e",
      firstName: "Alex",
      name: "Alex Test",
      householdId: "hh-e2e",
      householdName: "The Test Family",
      isPlusOne: false,
      dietary: "",
      invitedEvents: ["reception"],
      responses: {} as HouseholdRoster["members"][number]["responses"],
    },
  ],
};

test("find household, RSVP, and submit (stubbed API)", async ({ page }) => {
  await page.route("**/api/rsvp/search**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ households: [HOUSEHOLD] }),
    }),
  );
  await page.route("**/api/rsvp/submit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, updated: 1, errors: [] }),
    }),
  );

  await page.goto("/rsvp");
  await page.getByLabel("Enter your name").fill("Alex");
  await page.getByRole("button", { name: /The Test Family/ }).click();

  await expect(page.getByText("Alex Test")).toBeVisible();
  await expect(
    page.getByLabel("Dietary restrictions (optional)"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await page.getByRole("button", { name: "Submit RSVP" }).click();

  await expect(page.getByText("Thank you!")).toBeVisible();
});
