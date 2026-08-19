// Vitest stand-in for the `server-only` poison package, which throws when
// imported outside a React Server Components build. Unit tests import server
// modules (lib/notify, lib/airtable) directly, so alias it to this no-op.
export {};
