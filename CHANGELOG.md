# Changelog

All notable changes to the wedding website. Versions follow a 4-digit
`MAJOR.MINOR.PATCH.MICRO` scheme; dates are `YYYY-MM-DD`.

## [0.2.0.0] - 2026-08-18

### Added
- **Music page** (`/music`): the wedding playlist, embedded and playable right
  on the site — framed as the page's centerpiece, with an "Open in Spotify"
  link, a numbered "Nuestras Canciones" setlist of songs that matter to us,
  and a "Request a Song" form so guests can send picks straight to the DJ's
  list. Headings, key messages, and the player size are editable in Keystatic.
- Song requests land in Airtable and, when Resend email is configured, email
  the couple on every submission — with a separate alert email if a request
  ever fails to save.
- Countdown can now be toggled for the Music and RSVP pages independently in
  the CMS.
- Continuous integration: lint, unit tests, and a production build now run on
  every pull request and every push to main.

### Changed
- Navigation fits all 11 tabs on one row on laptop screens, and the active
  page's olive highlight is no longer clipped by the bar.
- The couple's names scale to stay on one line each on any phone (hero), and
  never break mid-name in the footer.
- RSVP's countdown obeys its own CMS checkbox (it was wired to the FAQs
  toggle by mistake).
- Form inputs across RSVP and Music share one component, with a visible
  keyboard-focus outline.

### Fixed
- Guests who hit the song-request rate limit now see "slow down" guidance
  instead of being told to retry immediately.
- Song request text is sanitized (control characters stripped) before it
  reaches notification emails, and setlist links only render safe https URLs.
