import { eq } from "drizzle-orm";
import { coinResearch } from "../drizzle/schema";
import { getDb } from "./db";

export type EducationalScreening = {
  status: "needs_scholar_review" | "research_incomplete" | "higher_risk_flags";
  assetBacking: string;
  utilitySummary: string;
  interestExposure: "unknown" | "none_stated" | "present";
  speculationExposure: "unknown" | "low" | "elevated";
  transparencyState: "unknown" | "limited" | "documented";
  evidenceNote: string;
  sourceUrl: string | null;
  updatedAt: Date | null;
};

export function educationalScreeningFallback(coinName: string): EducationalScreening {
  return {
    status: "research_incomplete",
    assetBacking: `Live price data does not establish whether ${coinName} has asset backing, reserve backing, or another underlying economic claim.`,
    utilitySummary: "Review the official project documentation, token design, governance, and stated network use before reaching a conclusion.",
    interestExposure: "unknown",
    speculationExposure: "unknown",
    transparencyState: "unknown",
    evidenceNote: "No curated research record has been published in CryptoLens yet. This page is an educational screen, not a fatwa, certification, or investment recommendation.",
    sourceUrl: "https://aaoifi.com/?lang=en",
    updatedAt: null,
  };
}

export async function getEducationalScreening(coinId: string, coinName: string): Promise<EducationalScreening> {
  const db = await getDb();
  if (!db) return educationalScreeningFallback(coinName);

  const [record] = await db.select().from(coinResearch).where(eq(coinResearch.coinId, coinId)).limit(1);
  if (!record) return educationalScreeningFallback(coinName);

  return {
    status: record.screeningStatus,
    assetBacking: record.assetBacking || educationalScreeningFallback(coinName).assetBacking,
    utilitySummary: record.utilitySummary || educationalScreeningFallback(coinName).utilitySummary,
    interestExposure: record.interestExposure,
    speculationExposure: record.speculationExposure,
    transparencyState: record.transparencyState,
    evidenceNote: record.evidenceNote || educationalScreeningFallback(coinName).evidenceNote,
    sourceUrl: record.sourceUrl ?? null,
    updatedAt: record.updatedAt,
  };
}
