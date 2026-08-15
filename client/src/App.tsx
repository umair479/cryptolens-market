/* CryptoLens Market style reminder: Nocturne Ledger — dark editorial terminal, asymmetric rail-first layout, Lens Lime signals, Sora + DM Sans + IBM Plex Mono, restrained motion. */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getNavigationScrollTarget, getSamePageAnchorId } from "@/lib/navigationScroll";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Exchanges from "./pages/Exchanges";
import Learn from "./pages/Learn";
import Watchlist from "./pages/Watchlist";
import CoinDetail from "./pages/CoinDetail";
import Account from "./pages/Account";
import ResearchDetail from "./pages/ResearchDetail";

function RouteScrollPosition() {
  const [location] = useLocation();

  useEffect(() => {
    const target = getNavigationScrollTarget(window.location.hash);
    if (target.kind === "top") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    let attempts = 0;
    let retryTimer: number | undefined;
    const scrollToAnchor = () => {
      const element = document.getElementById(target.id);
      if (element) {
        element.scrollIntoView({ block: "start", behavior: "auto" });
        return;
      }

      attempts += 1;
      if (attempts < 8) retryTimer = window.setTimeout(scrollToAnchor, 120);
    };

    const animationFrame = window.requestAnimationFrame(scrollToAnchor);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [location]);

  useEffect(() => {
    const handleSamePageAnchor = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const origin = event.target;
      if (!(origin instanceof Element)) return;

      const link = origin.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const anchorId = getSamePageAnchorId(link.href, window.location.href);
      if (!anchorId) return;

      window.setTimeout(() => document.getElementById(anchorId)?.scrollIntoView({ block: "start", behavior: "auto" }), 0);
    };

    document.addEventListener("click", handleSamePageAnchor);
    return () => document.removeEventListener("click", handleSamePageAnchor);
  }, []);

  return null;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <RouteScrollPosition />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/categories" component={Categories} />
        <Route path="/exchanges" component={Exchanges} />
        <Route path="/learn" component={Learn} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/account" component={Account} />
        <Route path="/research/:slug" component={ResearchDetail} />
        <Route path="/coin/:id" component={CoinDetail} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
