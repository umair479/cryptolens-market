/* CryptoLens Market style reminder: Nocturne Ledger — dark editorial terminal, asymmetric rail-first layout, Lens Lime signals, Sora + DM Sans + IBM Plex Mono, restrained motion. */

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bookmark,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Compass,
  Copy,
  Eye,
  LayoutGrid,
  LineChart,
  Menu,
  Moon,
  MoreHorizontal,
  Search,
  Settings2,
  Star,
  TrendingUp,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

type Coin = {
  rank: number;
  symbol: string;
  name: string;
  price: string;
  change: number;
  marketCap: string;
  volume: string;
  category: string;
  color: string;
  spark: number[];
};

const heroTexture = "/manus-storage/cryptolens-hero-texture_bb10c7e3.png";
const signalTexture = "/manus-storage/cryptolens-signal-panel_2c59b8a6.png";
const mark = "/manus-storage/cryptolens-mark_3a6b7471.png";

const coins: Coin[] = [
  { rank: 1, symbol: "BTC", name: "Bitcoin", price: "$67,428.18", change: 2.84, marketCap: "$1.33T", volume: "$28.4B", category: "Layer 1", color: "#F59E0B", spark: [38, 39, 37, 42, 41, 44, 46, 45, 49, 52, 51, 56, 55, 59, 62] },
  { rank: 2, symbol: "ETH", name: "Ethereum", price: "$3,582.40", change: 1.62, marketCap: "$430.7B", volume: "$14.7B", category: "Layer 1", color: "#9CA3AF", spark: [56, 53, 54, 52, 55, 57, 56, 58, 57, 60, 62, 61, 63, 62, 64] },
  { rank: 3, symbol: "USDT", name: "Tether", price: "$1.00", change: 0.01, marketCap: "$112.1B", volume: "$39.6B", category: "Stablecoin", color: "#26A17B", spark: [48, 49, 49, 49, 50, 49, 50, 50, 50, 49, 50, 50, 50, 50, 50] },
  { rank: 4, symbol: "SOL", name: "Solana", price: "$178.92", change: -0.76, marketCap: "$82.8B", volume: "$3.1B", category: "Layer 1", color: "#B58CFF", spark: [67, 71, 70, 73, 69, 66, 68, 64, 62, 65, 61, 60, 59, 56, 58] },
  { rank: 5, symbol: "BNB", name: "BNB", price: "$594.81", change: 0.48, marketCap: "$88.2B", volume: "$1.2B", category: "Layer 1", color: "#F3BA2F", spark: [46, 45, 47, 48, 47, 49, 48, 50, 49, 50, 51, 52, 51, 53, 54] },
  { rank: 6, symbol: "XRP", name: "XRP", price: "$0.5238", change: -1.38, marketCap: "$28.9B", volume: "$1.4B", category: "Layer 1", color: "#A8B1BD", spark: [63, 61, 62, 59, 60, 57, 58, 55, 54, 52, 53, 51, 49, 50, 48] },
  { rank: 7, symbol: "DOGE", name: "Dogecoin", price: "$0.1432", change: 4.12, marketCap: "$20.7B", volume: "$1.8B", category: "Meme", color: "#C2A633", spark: [37, 38, 41, 40, 43, 47, 45, 49, 51, 50, 54, 57, 56, 60, 64] },
  { rank: 8, symbol: "AVAX", name: "Avalanche", price: "$36.14", change: 3.64, marketCap: "$14.2B", volume: "$742M", category: "Layer 1", color: "#E84142", spark: [42, 44, 43, 47, 49, 48, 52, 51, 54, 55, 58, 57, 61, 62, 66] },
  { rank: 9, symbol: "LINK", name: "Chainlink", price: "$14.37", change: -0.24, marketCap: "$8.7B", volume: "$328M", category: "DeFi", color: "#2A5ADA", spark: [52, 53, 51, 52, 50, 51, 49, 50, 48, 49, 48, 47, 48, 47, 48] },
  { rank: 10, symbol: "NEAR", name: "NEAR Protocol", price: "$5.84", change: 5.87, marketCap: "$6.9B", volume: "$478M", category: "AI", color: "#D6D7D9", spark: [31, 34, 33, 38, 39, 42, 41, 46, 48, 47, 52, 55, 57, 61, 68] },
];

const navItems = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Rankings", icon: BarChart3 },
  { label: "Watchlist", icon: Bookmark },
  { label: "Discover", icon: Compass },
];

const intelItems = [
  { label: "Signals", icon: Zap },
  { label: "Research", icon: LineChart },
];

const tabs = ["All assets", "Layer 1", "DeFi", "Meme", "AI"];

function Sparkline({ values, tone = "positive", large = false }: { values: number[]; tone?: "positive" | "negative" | "neutral"; large?: boolean }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const path = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 28 - ((value - min) / (max - min || 1)) * 22;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke = tone === "negative" ? "#E78360" : tone === "neutral" ? "#9CA3AF" : "#C7F36B";

  return (
    <svg className={large ? "sparkline sparkline-large" : "sparkline"} viewBox="0 0 100 32" role="img" aria-label={`${tone} trend sparkline`}>
      <path d={path} fill="none" stroke={stroke} strokeWidth={large ? "1.7" : "1.45"} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    </svg>
  );
}

function ChangeValue({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? "change-value is-positive" : "change-value is-negative"}>
      {isPositive ? <ArrowUpRight size={13} strokeWidth={2.5} /> : <ArrowDownRight size={13} strokeWidth={2.5} />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function CoinGlyph({ coin, size = "normal" }: { coin: Coin; size?: "normal" | "small" }) {
  return (
    <span className={`coin-glyph ${size === "small" ? "coin-glyph-small" : ""}`} style={{ background: `${coin.color}1c`, color: coin.color }}>
      {coin.symbol.slice(0, 1)}
    </span>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState("Overview");
  const [activeTab, setActiveTab] = useState("All assets");
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState<Set<string>>(() => new Set(["BTC", "ETH"]));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const visibleCoins = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return coins.filter((coin) => {
      const matchesSearch = !normalized || coin.name.toLowerCase().includes(normalized) || coin.symbol.toLowerCase().includes(normalized);
      const matchesTab = activeTab === "All assets" || coin.category === activeTab;
      const matchesWatchlist = activeView !== "Watchlist" || watchlist.has(coin.symbol);
      return matchesSearch && matchesTab && matchesWatchlist;
    });
  }, [activeTab, activeView, search, watchlist]);

  function handleNav(label: string) {
    if (label === "Signals" || label === "Research") {
      toast(`${label} is on the roadmap`, { description: "The market overview is ready to explore while we tune this workspace." });
      return;
    }
    setActiveView(label);
    setMobileNavOpen(false);
  }

  function toggleWatchlist(symbol: string) {
    setWatchlist((current) => {
      const next = new Set(current);
      if (next.has(symbol)) {
        next.delete(symbol);
        toast(`${symbol} removed from watchlist`);
      } else {
        next.add(symbol);
        toast(`${symbol} saved to watchlist`, { description: "Your saved assets stay visible in the Watchlist view." });
      }
      return next;
    });
  }

  function copySnapshot() {
    toast("Brief pinned", { description: "A shareable market snapshot is ready for your team." });
  }

  return (
    <div className="app-shell">
      <aside className={`side-rail ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="rail-brand">
          <img src={mark} alt="" className="brand-mark" />
          <div className="brand-lockup">
            <span className="brand-name">CryptoLens</span>
            <span className="brand-subtitle">MARKET INTELLIGENCE</span>
          </div>
          <button className="icon-button rail-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={17} /></button>
        </div>

        <div className="rail-divider" />
        <p className="rail-label">Workspace</p>
        <nav className="rail-nav" aria-label="Workspace navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`rail-link ${activeView === label ? "is-active" : ""}`} onClick={() => handleNav(label)}>
              <Icon size={17} strokeWidth={activeView === label ? 2.3 : 1.8} />
              <span>{label}</span>
              {label === "Watchlist" && <span className="nav-count">{watchlist.size}</span>}
            </button>
          ))}
        </nav>

        <p className="rail-label rail-label-spaced">Intel desk</p>
        <nav className="rail-nav" aria-label="Intel navigation">
          {intelItems.map(({ label, icon: Icon }) => (
            <button key={label} className="rail-link" onClick={() => handleNav(label)}>
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Signals" && <span className="signal-live-dot" aria-label="Live" />}
            </button>
          ))}
        </nav>

        <div className="rail-spacer" />
        <div className="rail-note">
          <div className="rail-note-top"><span className="signal-pip" /> <span>Data status</span></div>
          <p>Illustrative market feed</p>
          <span className="mono-note">UPDATED 12:48:06 UTC</span>
        </div>
        <button className="rail-link rail-settings" onClick={() => toast("Settings are coming soon", { description: "Your preferences will live here." })}>
          <Settings2 size={17} strokeWidth={1.8} />
          <span>Settings</span>
        </button>
        <div className="rail-profile">
          <span className="profile-avatar">AL</span>
          <span className="profile-copy"><strong>Alex Lee</strong><small>Researcher</small></span>
          <MoreHorizontal size={17} className="profile-more" />
        </div>
      </aside>

      <main className="main-shell">
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
            <div className="top-brand"><img src={mark} alt="" /><span>CryptoLens</span></div>
            <span className="topbar-separator" />
            <div className="breadcrumb"><span className="breadcrumb-muted">MARKET</span><ChevronRight size={13} /><span>{activeView.toUpperCase()}</span></div>
          </div>
          <div className="top-bar-actions">
            <span className="market-status"><span className="status-dot" /> All systems nominal</span>
            <button className="icon-button" onClick={() => toast("No new alerts", { description: "We will surface meaningful market events here." })} aria-label="Notifications"><Bell size={17} /></button>
            <button className="icon-button" onClick={() => toast("Theme is set to Nocturne Ledger")} aria-label="Current theme"><Moon size={17} /></button>
            <div className="top-avatar">AL</div>
          </div>
        </header>

        <div className="content-wrap">
          <section className="hero-panel" style={{ backgroundImage: `linear-gradient(90deg, rgba(20, 22, 20, 0.98) 0%, rgba(20, 22, 20, 0.92) 42%, rgba(20, 22, 20, 0.42) 100%), url(${heroTexture})` }}>
            <div className="hero-copy">
              <div className="eyebrow"><span className="signal-pip" /> LIVE MARKET BRIEF <span className="eyebrow-divider" /> SYNCED 12:48 UTC</div>
              <div className="hero-snapshot-row" aria-label="Live market snapshot">
                <div className="snapshot-item"><span className="snapshot-symbol">BTC</span><strong>$67,428</strong><ChangeValue value={2.84} /></div>
                <div className="snapshot-item"><span className="snapshot-symbol">ETH</span><strong>$3,582</strong><ChangeValue value={1.62} /></div>
                <div className="snapshot-item"><span className="snapshot-symbol">BREADTH</span><strong>61%</strong><ChangeValue value={6.21} /></div>
              </div>
              <h1>The market<br /><em>in focus.</em></h1>
              <p className="hero-description">Track breadth, momentum, and capital rotation as they unfold.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => document.getElementById("market-table")?.scrollIntoView({ behavior: "smooth" })}>Scan the radar <ChevronRight size={16} /></button>
                <button className="text-button" onClick={copySnapshot}><Copy size={15} /> Pin this brief</button>
              </div>
            </div>
            <div className="hero-market-reading">
              <span className="reading-label">TOTAL MARKET CAP</span>
              <strong>$2.41T</strong>
              <ChangeValue value={1.84} />
              <div className="reading-line"><span style={{ width: "72%" }} /></div>
              <div className="reading-foot"><span>7D RANGE</span><span>$2.28T — $2.45T</span></div>
            </div>
            <div className="hero-corner-mark">CL / 01</div>
          </section>

          <section className="metrics-row" aria-label="Market metrics">
            <article className="metric-card metric-card-accent">
              <div className="metric-card-head"><span>Market cap</span><TrendingUp size={15} /></div>
              <strong>$2.41T</strong>
              <div className="metric-bottom"><ChangeValue value={1.84} /><span className="metric-period">vs. yesterday</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-card-head"><span>24h volume</span><BarChart3 size={15} /></div>
              <strong>$84.6B</strong>
              <div className="metric-bottom"><ChangeValue value={6.21} /><span className="metric-period">flow accelerating</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-card-head"><span>BTC dominance</span><CircleHelp size={15} /></div>
              <strong>52.7%</strong>
              <div className="metric-bottom"><ChangeValue value={-0.48} /><span className="metric-period">share of market</span></div>
            </article>
            <article className="metric-card metric-card-dark">
              <div className="metric-card-head"><span>Fear &amp; greed</span><span className="metric-index">68</span></div>
              <div className="sentiment-track"><span style={{ width: "68%" }} /></div>
              <div className="metric-bottom"><span className="sentiment-label">GREED</span><span className="metric-period">+4 from yesterday</span></div>
            </article>
          </section>

          <div className="section-grid">
            <section className="market-section" id="market-table">
              <div className="section-heading-row">
                <div>
                  <div className="eyebrow eyebrow-dark"><span className="signal-pip" /> ASSET RADAR</div>
                  <h2>{activeView === "Watchlist" ? "Your watchlist" : "Market overview"}</h2>
                </div>
                <button className="subtle-button" onClick={() => toast("Radar is already in focus", { description: "Use the asset tabs to narrow the scan." })}>View all <ChevronRight size={15} /></button>
              </div>
              <div className="table-toolbar">
                <div className="tab-row" role="tablist" aria-label="Asset categories">
                  {tabs.map((tab) => <button key={tab} className={`tab-button ${activeTab === tab ? "is-selected" : ""}`} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab}>{tab}</button>)}
                </div>
                <label className="search-field">
                  <Search size={15} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search assets" aria-label="Search assets" />
                </label>
              </div>

              <div className="table-card">
                <div className="table-scroll">
                  <div className="asset-table" role="table" aria-label="Cryptocurrency market rankings">
                    <div className="table-row table-header" role="row">
                      <span>#</span><span>Asset</span><span>Price</span><span>24h</span><span>Market cap / vol</span><span className="spark-heading">Trend / 7d</span><span />
                    </div>
                    {visibleCoins.length ? visibleCoins.map((coin) => (
                      <div className="table-row asset-row" role="row" key={coin.symbol}>
                        <span className="rank-cell">{String(coin.rank).padStart(2, "0")}</span>
                        <div className="asset-cell">
                          <CoinGlyph coin={coin} />
                          <div><strong>{coin.name}</strong><span>{coin.symbol}</span></div>
                        </div>
                        <strong className="price-cell">{coin.price}</strong>
                        <ChangeValue value={coin.change} />
                        <div className="table-stack"><span className="table-value">{coin.marketCap}</span><small>{coin.volume} vol</small></div>
                        <Sparkline values={coin.spark} tone={coin.change < 0 ? "negative" : coin.change === 0 ? "neutral" : "positive"} />
                        <button className={`watch-button ${watchlist.has(coin.symbol) ? "is-saved" : ""}`} onClick={() => toggleWatchlist(coin.symbol)} aria-label={`${watchlist.has(coin.symbol) ? "Remove" : "Add"} ${coin.name} ${watchlist.has(coin.symbol) ? "from" : "to"} watchlist`} aria-pressed={watchlist.has(coin.symbol)}><Star size={16} fill={watchlist.has(coin.symbol) ? "currentColor" : "none"} /></button>
                      </div>
                    )) : (
                      <div className="empty-state"><Search size={18} /><strong>No assets match your scan.</strong><span>Try a ticker, asset name, or switch tabs.</span><button className="text-button" onClick={() => { setSearch(""); setActiveTab("All assets"); }}>Clear filters</button></div>
                    )}
                  </div>
                </div>
                <div className="table-footnote"><span><span className="signal-pip" /> Illustrative dataset · API-ready surface</span><span>Showing {visibleCoins.length} of {coins.length} tracked assets <ChevronDown size={14} /></span></div>
              </div>
            </section>

            <aside className="signal-column">
              <div className="signal-card" style={{ backgroundImage: `linear-gradient(160deg, rgba(35, 40, 34, 0.96) 6%, rgba(35, 40, 34, 0.74) 100%), url(${signalTexture})` }}>
                <div className="signal-card-top"><span className="eyebrow">SIGNAL DESK</span><button className="icon-button icon-button-dark" onClick={() => toast("Signal detail is coming soon")} aria-label="More signal details"><MoreHorizontal size={17} /></button></div>
                <div className="signal-card-body"><span className="signal-kicker"><span className="signal-pip signal-pip-lime" /> MOMENTUM SHIFT</span><h3>Rotation is<br /><em>quietly broadening.</em></h3><p>Large caps are holding while mid-cap flows widen across L1 and AI infrastructure.</p></div>
                <div className="signal-card-bottom"><span>CONFIDENCE</span><strong>74 / 100</strong><div className="confidence-bar"><span style={{ width: "74%" }} /></div></div>
              </div>

              <div className="pulse-card">
                <div className="section-mini-head"><div><span className="eyebrow eyebrow-dark">MARKET PULSE</span><h3>What changed</h3></div><button className="icon-button" onClick={() => toast("Pulse feed refreshed")} aria-label="Refresh market pulse"><Eye size={16} /></button></div>
                <div className="pulse-list">
                  <div className="pulse-item"><span className="pulse-index">01</span><div><strong>Volume breadth</strong><p>Spot volume up across 61% of tracked assets.</p></div><ChangeValue value={6.2} /></div>
                  <div className="pulse-item"><span className="pulse-index">02</span><div><strong>ETH / BTC ratio</strong><p>Ratio steadies after three sessions of drift.</p></div><span className="pulse-neutral">FLAT</span></div>
                  <div className="pulse-item"><span className="pulse-index">03</span><div><strong>AI infrastructure</strong><p>NEAR and adjacent names lead today’s scan.</p></div><ChangeValue value={5.87} /></div>
                </div>
                <button className="full-width-button" onClick={() => toast("Full pulse report is coming soon", { description: "This preview keeps the feed focused on the highest-signal changes." })}>Read the pulse <ChevronRight size={15} /></button>
              </div>
            </aside>
          </div>

          <section className="watchlist-strip">
            <div className="watchlist-intro"><div className="eyebrow eyebrow-dark"><span className="signal-pip" /> PERSONAL BOARD</div><h2>Keep an eye<br />on the edges.</h2><p>Save the assets that deserve a second look. Your board stays one click away.</p><button className="subtle-button" onClick={() => handleNav("Watchlist")}>Open watchlist <ChevronRight size={15} /></button></div>
            <div className="watchlist-cards">
              {coins.filter((coin) => watchlist.has(coin.symbol)).slice(0, 3).map((coin) => (
                <article className="watch-card" key={coin.symbol}>
                  <div className="watch-card-head"><div className="asset-cell"><CoinGlyph coin={coin} size="small" /><div><strong>{coin.symbol}</strong><span>{coin.name}</span></div></div><button className="watch-button is-saved" onClick={() => toggleWatchlist(coin.symbol)} aria-label={`Remove ${coin.name} from watchlist`}><Star size={15} fill="currentColor" /></button></div>
                  <div className="watch-card-value"><strong>{coin.price}</strong><ChangeValue value={coin.change} /></div>
                  <Sparkline values={coin.spark} tone={coin.change < 0 ? "negative" : "positive"} large />
                  <div className="watch-card-foot"><span>MCAP {coin.marketCap}</span><span>VOL {coin.volume}</span></div>
                </article>
              ))}
              {!watchlist.size && <div className="watchlist-empty"><Bookmark size={19} /><p>Your board is clear.</p><span>Save an asset from the radar above.</span></div>}
            </div>
          </section>

          <footer className="site-footer"><span>© 2026 CryptoLens Market</span><span className="footer-center"><span className="signal-pip" /> Built for clearer decisions</span><span>Data is illustrative · Not financial advice</span></footer>
        </div>
      </main>
    </div>
  );
}
