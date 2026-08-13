import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function authenticatedContext(): TrpcContext {
  return {
    user: { id: 987654, openId: "watchlist-test-user", name: "Watchlist Test", email: null, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("watchlist router", () => {
  it("requires an authenticated visitor for saved assets", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] });
    await expect(caller.watchlist.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("validates coin identifiers before persistence", async () => {
    const caller = appRouter.createCaller(authenticatedContext());
    await expect(caller.watchlist.add({ coinId: "not valid" })).rejects.toBeDefined();
  });
});
