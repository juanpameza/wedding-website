# RSVP setup

The RSVP feature reads/writes guest responses in **Airtable**. The code is done;
these are the one-time data + config steps to make it live.

## 1. Create the Airtable base

Two tables:

### `Households`
| Field | Type |
|-------|------|
| `Name` | Single line text (e.g. "The Lopez Family") |
| `Members` | Link to `Guests` (Airtable auto-creates the reverse `Household` field) |

### `Guests`
| Field | Type | Notes |
|-------|------|-------|
| `First Name` | Single line text | optional; used for the "Maria, Juan, Sofia" preview line under the household name in search results. Falls back to `Name` if blank |
| `Name` | Single line text | full name; what search matches on, and the heading above each person's toggles |
| `Household` | Link to `Households` | auto-created by the link above |
| `Invited Events` | Multiple select | options exactly: `Beach Day`, `Welcome Dinner`, `Reception` |
| `Plus One` | Checkbox | tick for a +1 whose name you don't know. The form shows them a blank "Guest's name" box and writes the answer back into `Name` |
| `Dietary Restrictions` | Long text | guests fill this in themselves; you can also edit it |
| `Beach Day` | Single select | options exactly: `No response`, `Yes`, `No` (default `No response`) |
| `Welcome Dinner` | Single select | same three options |
| `Reception` | Single select | same three options |
| `Responded At` | Date (include time) | stamped on submit |
| `Last Modified` | Date (include time) | stamped on submit (audit) |

Field names and option values must match exactly — they map 1:1 from
[lib/rsvp-events.ts](lib/rsvp-events.ts).

## 2. Import your guest list (do this carefully)

Airtable does **not** auto-link records when you change a text column to a link.

1. Reshape your Google Sheet to **one row per guest** with columns: First Name,
   Name, Household Name, Invited Events.
2. Do a **dry run on a copy of the base** first.
3. Import into `Guests` — `Household Name` lands as plain text.
4. Convert that text column to **Link to `Households`**. Before converting,
   dedupe household names (trim whitespace, normalize case) so you don't create
   duplicate households.
5. Verify every Guest has exactly **one** `Household` link. Fix orphans.
6. Keep the original sheet so you can re-import if the conversion goes wrong.

**Open question to resolve:** is every household member invited to all three
events? If yes, set `Invited Events` to all three for everyone. If some are
reception-only, set `Invited Events` per guest — the form only shows toggles for
a guest's invited events.

## 2b. Party member order

Members appear on the form in the order Airtable returns them, which is the order
of the **view** we read from — `Grid view` by default.

- To change the order guests see, drag the rows in that view (or set the sort you
  want on it). No code change needed.
- If your view is named something other than `Grid view`, set
  `AIRTABLE_GUESTS_VIEW` to its exact name. If the name doesn't match, the app
  logs a warning and falls back to Airtable's default (unordered) list rather
  than breaking.

## 3. Environment variables

Copy `.env.local.example` → `.env.local` and fill in:

- `AIRTABLE_TOKEN` — a personal access token scoped to `data.records:read` +
  `data.records:write` on **this base only**.
- `AIRTABLE_BASE_ID` — the base id (starts with `app`).
- `RESEND_API_KEY` + `RSVP_NOTIFY_EMAIL` (optional) — to get an email on each
  submit. Without them, submits are logged server-side.

Set the same vars in the Vercel project settings for production.

Also update `CONTACT_EMAIL` in [app/rsvp/RsvpClient.tsx](app/rsvp/RsvpClient.tsx)
to the address guests should use if they can't find themselves.

## 4. How it works

- Search is served from the full guest list cached via Next.js Data Cache
  (revalidates every 5 min, and immediately after a submit), so typing doesn't
  hammer Airtable's 5 req/s limit.
- The submit endpoint re-validates server-side: each guest must belong to the
  matched household, and you can only set events that guest is invited to.
- Writes are batched (≤10 records/call), update-by-id (idempotent), and stamp
  the audit dates.

## 5. Tests

```bash
npm test        # Vitest unit tests for the matching/validation core
npm run e2e      # Playwright smoke (needs `npx playwright install` once)
```

The full E2E journey is `test.skip`-ed until you point `RSVP_E2E_GUEST` at a name
in a test base — see [e2e/rsvp.spec.ts](e2e/rsvp.spec.ts).

## Admin (tracking + edits)

Use Airtable directly — group `Guests` by `Beach Day` / `Welcome Dinner` /
`Reception` for live headcounts, filter to "Responded", and edit any cell. Share
the base with your fiancée for collaborative editing.
