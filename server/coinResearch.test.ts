import { describe, expect, it } from "vitest";
import { educationalScreeningFallback, getEducationalScreening } from "./coinResearch";

describe("educational screening fallback", () => {
  it("keeps unrated assets in an explicitly non-binding research state", () => {
    const screening = educationalScreeningFallback("Bitcoin");

    expect(screening.status).toBe("research_incomplete");
    expect(screening.evidenceNote).toContain("not a fatwa");
    expect(screening.assetBacking).toContain("Bitcoin");
  });

  it("reads the persisted Bitcoin research record from the project database", async () => {
    const screening = await getEducationalScreening("bitcoin", "Bitcoin");

    expect(screening.status).toBe("needs_scholar_review");
    expect(screening.transparencyState).toBe("documented");
    expect(screening.evidenceNote).toContain("does not issue a halal or haram determination");
  });
});
