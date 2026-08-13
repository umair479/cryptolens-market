import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Curated, educational context for a coin detail page. Live market prices remain
 * upstream-provider data; this table only stores editorial and screening metadata.
 */
export const coinResearch = mysqlTable("coin_research", {
  id: int("id").autoincrement().primaryKey(),
  coinId: varchar("coinId", { length: 128 }).notNull().unique(),
  displayName: varchar("displayName", { length: 160 }).notNull(),
  summary: text("summary"),
  assetBacking: text("assetBacking"),
  utilitySummary: text("utilitySummary"),
  interestExposure: mysqlEnum("interestExposure", ["unknown", "none_stated", "present"]).default("unknown").notNull(),
  speculationExposure: mysqlEnum("speculationExposure", ["unknown", "low", "elevated"]).default("unknown").notNull(),
  transparencyState: mysqlEnum("transparencyState", ["unknown", "limited", "documented"]).default("unknown").notNull(),
  screeningStatus: mysqlEnum("screeningStatus", ["needs_scholar_review", "research_incomplete", "higher_risk_flags"]).default("needs_scholar_review").notNull(),
  evidenceNote: text("evidenceNote"),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoinResearch = typeof coinResearch.$inferSelect;
export type InsertCoinResearch = typeof coinResearch.$inferInsert;

/** User-owned saved assets. Price data remains live and is never duplicated here. */
export const userWatchlistItems = mysqlTable("user_watchlist_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  coinId: varchar("coinId", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [uniqueIndex("user_watchlist_coin_unique").on(table.userId, table.coinId)]);

export type UserWatchlistItem = typeof userWatchlistItems.$inferSelect;
