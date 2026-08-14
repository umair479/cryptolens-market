import { describe, expect, it } from "vitest";
import { createStaleWhileRevalidateCache } from "./marketCache";

describe("stale-while-revalidate market cache", () => {
  it("deduplicates concurrent loads and serves a fresh cached value", async () => {
    let now = 0;
    let calls = 0;
    const cache = createStaleWhileRevalidateCache<number>({ freshMs: 100, staleMs: 500, now: () => now });
    const loader = async () => { calls += 1; return 42; };

    const [first, second] = await Promise.all([cache.get("snapshot", loader), cache.get("snapshot", loader)]);
    expect([first, second]).toEqual([42, 42]);
    expect(calls).toBe(1);

    now = 50;
    await expect(cache.get("snapshot", loader)).resolves.toBe(42);
    expect(calls).toBe(1);
  });

  it("returns stale data immediately while a background refresh starts", async () => {
    let now = 0;
    let value = 10;
    const cache = createStaleWhileRevalidateCache<number>({ freshMs: 20, staleMs: 200, now: () => now });
    await cache.get("snapshot", async () => value);
    now = 25;
    value = 20;

    await expect(cache.get("snapshot", async () => value)).resolves.toBe(10);
    await Promise.resolve();
    now = 30;
    await expect(cache.get("snapshot", async () => value)).resolves.toBe(20);
  });
});
