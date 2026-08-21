import { z } from "zod";
import { getCoinDetail } from "./coinDetail";
import { getCategories, getCategoryCoins, getExchanges, getMarketSnapshot } from "./marketData";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// Pre-warm the market cache on startup
void getMarketSnapshot().catch(() => undefined);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(() => null),
    logout: publicProcedure.mutation(() => ({ success: true })),
  }),
  market: router({
    snapshot: publicProcedure.query(() => getMarketSnapshot()),
    categories: publicProcedure.query(() => getCategories()),
    categoryCoins: publicProcedure
      .input(z.object({ categoryId: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/) }))
      .query(({ input }) => getCategoryCoins(input.categoryId)),
    exchanges: publicProcedure.query(() => getExchanges()),
    coin: publicProcedure
      .input(z.object({ id: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/) }))
      .query(({ input }) => getCoinDetail(input.id)),
  }),
  watchlist: router({
    list: publicProcedure.query(() => []),
    add: publicProcedure
      .input(z.object({ coinId: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/) }))
      .mutation(() => []),
    remove: publicProcedure
      .input(z.object({ coinId: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/) }))
      .mutation(() => []),
  }),
});

export type AppRouter = typeof appRouter;
