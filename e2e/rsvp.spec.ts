import { test, expect } from "@playwright/test";

// Smoke: the page renders and the search box is present (no Airtable needed).
test("rsvp page renders with a search box", async ({ page }) => {
  await page.goto("/rsvp");
  await expect(page.getByRole("heading", { name: "RSVP" })).toBeVisible();
  await expect(page.getByLabel("Enter your name")).toBeVisible();
});

// Full journey — needs seeded Airtable test data + creds. Enable by setting
// RSVP_E2E_GUEST to a name present in your (test) base, then remove .skip.
test.skip("find household, RSVP, and submit", async ({ page }) => {
  const name = process.env.RSVP_E2E_GUEST ?? "";
  await page.goto("/rsvp");
  await page.getByLabel("Enter your name").fill(name);
  await page.getByText(name, { exact: false }).first().click();
  await page.getByRole("button", { name: "Yes" }).first().click();
  await page.getByRole("button", { name: "Submit RSVP" }).click();
  await expect(page.getByText("Thank you!")).toBeVisible();
});
