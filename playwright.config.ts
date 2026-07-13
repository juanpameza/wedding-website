import { defineConfig } from "@playwright/test";

// E2E for the RSVP flow. The full find→toggle→submit journey needs a running
// app with Airtable creds + seeded test data; the smoke test runs without them.
// Set BASE_URL to test against a deployed/preview URL, or run `npm run dev` first.
export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
