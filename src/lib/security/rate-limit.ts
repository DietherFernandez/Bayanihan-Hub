const buckets = new Map<string, { count: number; resetAt: number }>();
const MAX_BUCKETS_BEFORE_PRUNE = 2000;

function pruneExpiredBuckets(now: number) {
  if (buckets.size <= MAX_BUCKETS_BEFORE_PRUNE) return;
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
  // If still above double capacity due to active flood, evict oldest insertion entries
  if (buckets.size > MAX_BUCKETS_BEFORE_PRUNE * 2) {
    let evicted = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      evicted += 1;
      if (evicted >= 500) break;
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  pruneExpiredBuckets(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}
