# TODOS

## RSVP: deadline / freeze state
- **What:** A cutoff date after which `/rsvp` becomes read-only and shows "RSVPs closed."
- **Why:** Stop changes after you've given counts to vendors; avoid late edits skewing headcount.
- **Pros:** Clean cutoff, no manual policing; clear guest messaging.
- **Cons:** Minor extra logic (date check + closed state); needs a real cutoff date set.
- **Context:** Deferred during /plan-eng-review (2026-06-28). Wedding is March 2027, so this is
  needed well before then, not at v1. Add a `deadline` to `lib/rsvp-events.ts` (or env) and a
  guard in `app/rsvp/page.tsx` + `POST /api/rsvp/submit` that returns a closed state past it.
- **Depends on:** Core RSVP feature shipped; a decided cutoff date.

## RSVP: extra guest fields (dietary / meal / kids-vs-adults)
- **What:** Optional `Guests` fields — dietary restrictions / notes, maybe meal choice, maybe an
  adults-vs-kids flag for catering counts.
- **Why:** Caterer headcounts and meal planning.
- **Pros:** One-field additions to the Airtable schema + form; high value for catering.
- **Cons:** Adds form length; meal options not known yet.
- **Context:** Deferred during /plan-eng-review (2026-06-28). Schema already leaves room
  (`Dietary / Notes`). Add fields once the caterer's requirements are known.
- **Depends on:** Core RSVP feature shipped; caterer requirements.
