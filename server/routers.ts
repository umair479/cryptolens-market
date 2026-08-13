import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getCoinDetail } from "./coinDetail";
import { addUserWatchlistItem, getUserWatchlist, removeUserWatchlistItem } from "./db";
import { getCategories, getCategoryCoins, getExchanges, getMarketSnapshot } from "./marketData";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  market: router({
    snapshot: publicProcedure.query(() => getMarketSnapshot()),
    categories: publicProcedure.query(() => getCategories()),
    categoryCoins: publicProcedure.input(z.object({ categoryId: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/) })).query(({ input }) => getCategoryCoins(input.categoryId)),
    exchanges: publicProcedure.query(() => getExchanges()),
    coin: publicProcedure.input(z.object({ id: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/) })).query(({ input }) => getCoinDetail(input.id)),
  }),
  watchlist: router({
    list: protectedProcedure.query(({ ctx }) => getUserWatchlist(ctx.user.id)),
    add: protectedProcedure.input(z.object({ coinId: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/) })).mutation(({ ctx, input }) => addUserWatchlistItem(ctx.user.id, input.coinId)),
    remove: protectedProcedure.input(z.object({ coinId: z.string().min(1).max(128).regex(/^[a-z0-9-]+$/) })).mutation(({ ctx, input }) => removeUserWatchlistItem(ctx.user.id, input.coinId)),
  }),
});

export type AppRouter = typeof appRouter;
