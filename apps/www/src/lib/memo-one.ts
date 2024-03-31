interface cacheItem {
  data: any;
  expired: number;
}

const cache = new Map<string, cacheItem>();

export async function memoOne<T>(key: string, fn: () => Promise<T>, ttl = 60) {
  const item = cache.get(key);
  if (item && item.expired > Date.now()) {
    return item.data as T;
  }
  const data = await fn();
  cache.set(key, {
    data,
    expired: Date.now() + ttl * 1000,
  });
  return data as T;
}
