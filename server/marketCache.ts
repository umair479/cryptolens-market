type CacheEntry<T> = { freshUntil: number; staleUntil: number; value: T };

type CacheOptions = {
  freshMs: number;
  staleMs: number;
  now?: () => number;
};

export function createStaleWhileRevalidateCache<T>({ freshMs, staleMs, now = () => Date.now() }: CacheOptions) {
  const entries = new Map<string, CacheEntry<T>>();
  const pending = new Map<string, Promise<T>>();

  const refresh = (key: string, loader: () => Promise<T>) => {
    const current = pending.get(key);
    if (current) return current;
    const task = loader().then((value) => {
      const timestamp = now();
      entries.set(key, { value, freshUntil: timestamp + freshMs, staleUntil: timestamp + staleMs });
      return value;
    }).finally(() => pending.delete(key));
    pending.set(key, task);
    return task;
  };

  return {
    async get(key: string, loader: () => Promise<T>) {
      const entry = entries.get(key);
      const timestamp = now();
      if (entry && entry.freshUntil > timestamp) return entry.value;
      if (entry && entry.staleUntil > timestamp) {
        void refresh(key, loader).catch(() => undefined);
        return entry.value;
      }
      return refresh(key, loader);
    },
    clear() {
      entries.clear();
      pending.clear();
    },
  };
}
