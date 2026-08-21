import { Bell, Bookmark, Menu, Search, WalletCards, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { formatCompactUsd, formatUpdated } from "@/lib/marketFormat";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

type MarketHeaderProps = {
  active: "market" | "categories" | "exchanges" | "learn" | "watchlist" | "account";
  watchCount?: number;
  search?: string;
  onSearchChange?: (value: string) => void;
};

const navigation = [
  { key: "market", label: "Cryptocurrencies", href: "/" },
  { key: "categories", label: "Categories", href: "/categories" },
  { key: "exchanges", label: "Exchanges", href: "/exchanges" },
  { key: "learn", label: "Learn", href: "/learn" },
] as const;

export function MarketHeader({ active, watchCount = 0, search, onSearchChange }: MarketHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [, setLocation] = useLocation();
  const marketPulse = trpc.market.snapshot.useQuery(undefined, { staleTime: 15_000, refetchInterval: 20_000, retry: false });
  const savedCount = watchCount; // No dynamic count since no auth
  const effectiveSearch = search ?? localSearch;
  const query = effectiveSearch.trim().toLowerCase();
  const searchResults = useMemo(() => !query ? [] : (marketPulse.data?.coins ?? []).filter((coin) => coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query)).slice(0, 6), [marketPulse.data?.coins, query]);
  const setSearchValue = (value: string) => onSearchChange ? onSearchChange(value) : setLocalSearch(value);
  const openCoin = (coinId: string) => { setSearchValue(""); setLocation(`/coin/${coinId}`); };

  return <>
    <header className="site-header">
      <div className="header-inner">
        <button className="mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
        <Link href="/" className="brand-lockup" aria-label="CryptoLens Market home"><span className="brand-mark-box"><BrandMark className="brand-mark" /></span><span className="brand-wordmark">CryptoLens</span><span className="brand-tagline">MARKET</span></Link>
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
          {navigation.map((item) => <Link key={item.key} href={item.href} className={active === item.key ? "is-active" : ""} onClick={() => setMobileOpen(false)}>{item.label}</Link>)}
          <Link href="/watchlist" className={active === "watchlist" ? "is-active" : ""} onClick={() => setMobileOpen(false)}><Bookmark size={14} /> Popular <span className="nav-badge">10</span></Link>
        </nav>
        <div className="header-actions">
          <div className="global-search-wrap"><label className="global-search"><Search size={16} /><input value={effectiveSearch} onChange={(event) => setSearchValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && searchResults[0]) openCoin(searchResults[0].id); if (event.key === "Escape") setSearchValue(""); }} placeholder="Search 600 coins" aria-label="Search cryptocurrencies" /></label>{query && <div className="global-search-results">{searchResults.length ? searchResults.map((coin) => <button key={coin.id} onClick={() => openCoin(coin.id)}>{coin.image ? <img src={coin.image} alt={coin.name} width={19} height={19} style={{ borderRadius: "50%", objectFit: "contain" }} /> : <span>{coin.symbol.slice(0, 1)}</span>}<strong>{coin.name}</strong><small>{coin.symbol}</small></button>) : <p>No matching assets in the live 600-coin universe.</p>}</div>}</div>
          <button className="header-icon" onClick={() => toast("No new alerts", { description: "Live provider status is displayed within each market view." })} aria-label="Notifications"><Bell size={17} /></button>
          <button className="header-icon" onClick={() => toast("Portfolio tools are coming soon")} aria-label="Portfolio"><WalletCards size={17} /></button>
          <Link href="/account" className="header-button">About</Link>
        </div>
      </div>
    </header>
    <div className="market-pulse-strip" aria-label="Live global market overview"><span><i /> LIVE MARKET</span><span>Market cap <strong>{marketPulse.data ? formatCompactUsd(marketPulse.data.overview.totalMarketCap) : "Syncing"}</strong></span><span>24h volume <strong>{marketPulse.data ? formatCompactUsd(marketPulse.data.overview.totalVolume) : "—"}</strong></span><span>BTC dominance <strong>{marketPulse.data ? `${marketPulse.data.overview.bitcoinDominance.toFixed(1)}%` : "—"}</strong></span><span className="pulse-source">{marketPulse.data ? marketPulse.isFetching ? "Refreshing cached snapshot…" : `Updated ${formatUpdated(marketPulse.data.overview.updatedAt)}` : "Connecting to live providers"}</span></div>
  </>;
}
