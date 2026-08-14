import { describe, expect, it } from "vitest";
import { getResearchTopic, researchTopics } from "./researchTopics";

describe("research topic library", () => {
  it("provides unique, detailed routes for every educational topic", () => {
    const slugs = researchTopics.map((topic) => topic.slug);

    expect(new Set(slugs).size).toBe(researchTopics.length);
    expect(researchTopics.length).toBeGreaterThanOrEqual(6);
    expect(researchTopics.every((topic) => topic.sections.length >= 3 && topic.checklist.length >= 3 && topic.sources.length >= 1)).toBe(true);
    expect(researchTopics.every((topic) => topic.liveHref.startsWith("/"))).toBe(true);
  });

  it("resolves a research topic by its public route slug", () => {
    expect(getResearchTopic("market-cap-in-context")?.title).toContain("Market cap");
    expect(getResearchTopic("unknown-topic")).toBeUndefined();
  });
});
