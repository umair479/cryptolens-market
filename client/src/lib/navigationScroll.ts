export type NavigationScrollTarget =
  | { kind: "top" }
  | { kind: "anchor"; id: string };

export function getNavigationScrollTarget(hash: string): NavigationScrollTarget {
  const rawId = hash.replace(/^#/, "").trim();
  if (!rawId) return { kind: "top" };

  try {
    return { kind: "anchor", id: decodeURIComponent(rawId) };
  } catch {
    return { kind: "top" };
  }
}

export function getSamePageAnchorId(destinationHref: string, currentHref: string): string | null {
  try {
    const destination = new URL(destinationHref, currentHref);
    const current = new URL(currentHref);
    if (destination.origin !== current.origin || destination.pathname !== current.pathname || destination.search !== current.search) return null;

    const target = getNavigationScrollTarget(destination.hash);
    return target.kind === "anchor" ? target.id : null;
  } catch {
    return null;
  }
}
