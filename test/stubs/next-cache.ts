// Vitest stand-in for `next/cache` so lib/airtable.ts imports cleanly in
// node tests. unstable_cache passes the function through un-cached;
// revalidateTag is a no-op.
export const unstable_cache = <T extends (...args: never[]) => unknown>(
  fn: T,
): T => fn;
export const revalidateTag = (): void => {};
