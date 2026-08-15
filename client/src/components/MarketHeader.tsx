import { Bell, Bookmark, LogOut, Menu, Search, UserRound, WalletCards, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { formatCompactUsd, formatUpdated } from "@/lib/marketFormat";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

const mark = "/manus-storage/cryptolens-mark_3a6b7471.png";

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
  const [accountOpen, setAccountOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [, setLocation] = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const savedAssets = trpc.watchlist.list.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30_000, retry: false });
  const marketPulse = trpc.market.snapshot.useQuery(undefined, { staleTime: 15_000, refetchInterval: 20_000, retry: false });
  const savedCount = savedAssets.data?.length ?? watchCount;
  const effectiveSearch = search ?? localSearch;
  const query = effectiveSearch.trim().toLowerCase();
  const searchResults = useMemo(() => !query ? [] : (marketPulse.data?.coins ?? []).filter((coin) => coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query)).slice(0, 6), [marketPulse.data?.coins, query]);
  const setSearchValue = (value: string) => onSearchChange ? onSearchChange(value) : setLocalSearch(value);
  const openCoin = (coinId: string) => { setSearchValue(""); setLocation(`/coin/${coinId}`); };

  return <>
    <header className="site-header">
      <div className="header-inner">
        <button className="mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
        <Link href="/" className="brand-lockup" aria-label="CryptoLens Market home"><span className="brand-mark-box"><img src={mark} alt="" /></span><span className="brand-wordmark">CryptoLens</span><span className="brand-tagline">MARKET</span></Link>
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
          {navigation.map((item) => <Link key={item.key} href={item.href} className={active === item.key ? "is-active" : ""} onClick={() => setMobileOpen(false)}>{item.label}</Link>)}
          <Link href="/watchlist" className={active === "watchlist" ? "is-active" : ""} onClick={() => setMobileOpen(false)}><Bookmark size={14} /> Watchlist <span className="nav-badge">{savedCount}</span></Link>
        </nav>
        <div className="header-actions">
          <div className="global-search-wrap"><label className="global-search"><Search size={16} /><input value={effectiveSearch} onChange={(event) => setSearchValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && searchResults[0]) openCoin(searchResults[0].id); if (event.key === "Escape") setSearchValue(""); }} placeholder="Search 600 coins" aria-label="Search cryptocurrencies" /></label>{query && <div className="global-search-results">{searchResults.length ? searchResults.map((coin) => <button key={coin.id} onClick={() => openCoin(coin.id)}><span>{coin.image ? <img src={coin.image} alt="" /> : coin.symbol.slice(0, 1)}</span><strong>{coin.name}</strong><small>{coin.symbol}</small></button>) : <p>No matching assets in the live 600-coin universe.</p>}</div>}</div>
          <button className="header-icon" onClick={() => toast("No new alerts", { description: "Live provider status is displayed within each market view." })} aria-label="Notifications"><Bell size={17} /></button>
          <button className="header-icon" onClick={() => toast("Portfolio tools are coming soon")} aria-label="Portfolio"><WalletCards size={17} /></button>
          {isAuthenticated ? <div className="account-control"><button className="account-button" onClick={() => setAccountOpen((current) => !current)} aria-expanded={accountOpen} aria-label="Open account menu"><span className="account-avatar">{user?.name?.slice(0, 1).toUpperCase() || <UserRound size={14} />}</span><span>{user?.name?.split(" ")[0] || "Account"}</span></button>{accountOpen && <div className="account-menu"><span>Signed in with Manus</span><Link href="/account" onClick={() => setAccountOpen(false)}><UserRound size={13} /> Account</Link><Link href="/watchlist" onClick={() => setAccountOpen(false)}><Bookmark size={13} /> Saved assets</Link><button onClick={() => { setAccountOpen(false); void logout(); }}><LogOut size={13} /> Sign out</button></div>}</div> : <div className="auth-entry"><button className="header-create" onClick={startLogin} disabled={loading}>Create account</button><button className="header-button" onClick={startLogin} disabled={loading}>Sign in</button></div>}
        </div>
      </div>
    </header>
    <div className="market-pulse-strip" aria-label="Live global market overview"><span><i /> LIVE MARKET</span><span>Market cap <strong>{marketPulse.data ? formatCompactUsd(marketPulse.data.overview.totalMarketCap) : "Syncing"}</strong></span><span>24h volume <strong>{marketPulse.data ? formatCompactUsd(marketPulse.data.overview.totalVolume) : "—"}</strong></span><span>BTC dominance <strong>{marketPulse.data ? `${marketPulse.data.overview.bitcoinDominance.toFixed(1)}%` : "—"}</strong></span><span className="pulse-source">{marketPulse.data ? marketPulse.isFetching ? "Refreshing cached snapshot…" : `Updated ${formatUpdated(marketPulse.data.overview.updatedAt)}` : "Connecting to live providers"}</span></div>
  </>;
}
