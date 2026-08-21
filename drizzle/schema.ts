import { integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Uses Supabase auth system which provides UUID-based user identification.
 * Extend this file with additional tables as your product grows.
 */
export const users = pgTable("users", {
  /**
   * Supabase user UUID from auth.users table.
   * This links to the built-in Supabase authentication system.
   */
  id: uuid("id").primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: varchar("role", { length: 64 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Create enums for PostgreSQL
export const interestExposureEnum = pgEnum("interestExposure", ["unknown", "none_stated", "present"]);
export const speculationExposureEnum = pgEnum("speculationExposure", ["unknown", "low", "elevated"]);
export const transparencyStateEnum = pgEnum("transparencyState", ["unknown", "limited", "documented"]);
export const screeningStatusEnum = pgEnum("screeningStatus", ["needs_scholar_review", "research_incomplete", "higher_risk_flags"]);

/**
 * Curated, educational context for a coin detail page. Live market prices remain
 * upstream-provider data; this table only stores editorial and screening metadata.
 */
export const coinResearch = pgTable("coin_research", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  coinId: varchar("coinId", { length: 128 }).notNull().unique(),
  displayName: varchar("displayName", { length: 160 }).notNull(),
  summary: text("summary"),
  assetBacking: text("assetBacking"),
  utilitySummary: text("utilitySummary"),
  interestExposure: interestExposureEnum("interestExposure").default("unknown").notNull(),
  speculationExposure: speculationExposureEnum("speculationExposure").default("unknown").notNull(),
  transparencyState: transparencyStateEnum("transparencyState").default("unknown").notNull(),
  screeningStatus: screeningStatusEnum("screeningStatus").default("needs_scholar_review").notNull(),
  evidenceNote: text("evidenceNote"),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoinResearch = typeof coinResearch.$inferSelect;
export type InsertCoinResearch = typeof coinResearch.$inferInsert;

/** User-owned saved assets. Price data remains live and is never duplicated here. */
export const userWatchlistItems = pgTable("user_watchlist_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("userId").notNull(),
  coinId: varchar("coinId", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [uniqueIndex("user_watchlist_coin_unique").on(table.userId, table.coinId)]);

export type UserWatchlistItem = typeof userWatchlistItems.$inferSelect;
