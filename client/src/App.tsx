/* CryptoLens Market style reminder: Nocturne Ledger — dark editorial terminal, asymmetric rail-first layout, Lens Lime signals, Sora + DM Sans + IBM Plex Mono, restrained motion. */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Exchanges from "./pages/Exchanges";
import Learn from "./pages/Learn";
import Watchlist from "./pages/Watchlist";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories" component={Categories} />
      <Route path="/exchanges" component={Exchanges} />
      <Route path="/learn" component={Learn} />
      <Route path="/watchlist" component={Watchlist} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
