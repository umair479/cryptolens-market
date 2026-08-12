import { Bell, Bookmark, Menu, Search, WalletCards, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

const mark = "/manus-storage/cryptolens-mark_3a6b7471.png";

type MarketHeaderProps = {
  active: "market" | "categories" | "exchanges" | "learn" | "watchlist";
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

  return <>
    <header className="site-header">
      <div className="header-inner">
        <button className="mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
        <Link href="/" className="brand-lockup" aria-label="CryptoLens Market home"><span className="brand-mark-box"><img src={mark} alt="" /></span><span className="brand-wordmark">CryptoLens</span><span className="brand-tagline">MARKET</span></Link>
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
          {navigation.map((item) => <Link key={item.key} href={item.href} className={active === item.key ? "is-active" : ""} onClick={() => setMobileOpen(false)}>{item.label}</Link>)}
          <Link href="/watchlist" className={active === "watchlist" ? "is-active" : ""} onClick={() => setMobileOpen(false)}><Bookmark size={14} /> Watchlist <span className="nav-badge">{watchCount}</span></Link>
        </nav>
        <div className="header-actions">
          <label className="global-search"><Search size={16} /><input value={search ?? ""} onChange={(event) => onSearchChange?.(event.target.value)} placeholder="Search coins" aria-label="Search cryptocurrencies" disabled={!onSearchChange} /></label>
          <button className="header-icon" onClick={() => toast("No new alerts", { description: "Live provider status is displayed within each market view." })} aria-label="Notifications"><Bell size={17} /></button>
          <button className="header-icon" onClick={() => toast("Portfolio tools are coming soon")} aria-label="Portfolio"><WalletCards size={17} /></button>
          <button className="header-button" onClick={() => toast("Sign-in is ready to connect", { description: "Authentication can be enabled for saved watchlists and alerts." })}>Sign in</button>
        </div>
      </div>
    </header>
  </>;
}
