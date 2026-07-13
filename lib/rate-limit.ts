// ─── Lightweight rate limiter ─────────────────────────────────────────────
//
// Fixed-window per-key limiter to slow roster enumeration on the public search
// endpoint (Eng review Tension 2). Per-instance on serverless, so it's a speed
// bump, not a hard wall — appropriate for a wedding's threat model.

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): { allowed: boolean; remaining: number } {
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count };
}

export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || "unknown";
  return ip;
}
