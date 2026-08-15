import { describe, expect, it } from "vitest";
import { getNavigationScrollTarget, getSamePageAnchorId } from "./navigationScroll";

describe("getNavigationScrollTarget", () => {
  it("sends ordinary route changes to the top of the destination page", () => {
    expect(getNavigationScrollTarget("")).toEqual({ kind: "top" });
  });

  it("preserves a valid named anchor for explicit section navigation", () => {
    expect(getNavigationScrollTarget("#islamic-ethics-screen")).toEqual({ kind: "anchor", id: "islamic-ethics-screen" });
  });

  it("decodes encoded anchors and safely falls back for malformed hashes", () => {
    expect(getNavigationScrollTarget("#provider%2Dstatus")).toEqual({ kind: "anchor", id: "provider-status" });
    expect(getNavigationScrollTarget("#%E0%A4%A")).toEqual({ kind: "top" });
  });

  it("recognizes only explicit anchors that stay on the current page", () => {
    expect(getSamePageAnchorId("/#live-rankings", "https://cryptolens.example/")).toBe("live-rankings");
    expect(getSamePageAnchorId("/exchanges#provider-status", "https://cryptolens.example/")).toBeNull();
    expect(getSamePageAnchorId("/", "https://cryptolens.example/")).toBeNull();
  });
});
