/* CryptoLens Market style reminder: light market intelligence UI — white surfaces, ink navy typography, Signal Blue accents, teal gainers, coral decliners, and compact exchange-style data density. */

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Filter,
  LineChart,
  Menu,
  Search,
  Star,
  TrendingUp,
  WalletCards,
  X,
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

const mark = "/manus-storage/cryptolens-mark_3a6b7471.png";
const signalTexture = "/manus-storage/cryptolens-signal-panel_2c59b8a6.png";

const coins: Coin[] = [
  { rank: 1, symbol: "BTC", name: "Bitcoin", price: "$67,428.18", change: 2.84, marketCap: "$1.33T", volume: "$28.4B", category: "Layer 1", color: "#F7931A", spark: [38, 39, 37, 42, 41, 44, 46, 45, 49, 52, 51, 56, 55, 59, 62] },
  { rank: 2, symbol: "ETH", name: "Ethereum", price: "$3,582.40", change: 1.62, marketCap: "$430.7B", volume: "$14.7B", category: "Layer 1", color: "#627EEA", spark: [56, 53, 54, 52, 55, 57, 56, 58, 57, 60, 62, 61, 63, 62, 64] },
  { rank: 3, symbol: "USDT", name: "Tether", price: "$1.00", change: 0.01, marketCap: "$112.1B", volume: "$39.6B", category: "Stablecoin", color: "#26A17B", spark: [48, 49, 49, 49, 50, 49, 50, 50, 50, 49, 50, 50, 50, 50, 50] },
  { rank: 4, symbol: "BNB", name: "BNB", price: "$594.81", change: 0.48, marketCap: "$88.2B", volume: "$1.2B", category: "Layer 1", color: "#F3BA2F", spark: [46, 45, 47, 48, 47, 49, 48, 50, 49, 50, 51, 52, 51, 53, 54] },
  { rank: 5, symbol: "SOL", name: "Solana", price: "$178.92", change: -0.76, marketCap: "$82.8B", volume: "$3.1B", category: "Layer 1", color: "#7C5CFC", spark: [67, 71, 70, 73, 69, 66, 68, 64, 62, 65, 61, 60, 59, 56, 58] },
  { rank: 6, symbol: "USDC", name: "USDC", price: "$1.00", change: 0.02, marketCap: "$32.4B", volume: "$7.7B", category: "Stablecoin", color: "#2775CA", spark: [49, 49, 50, 49, 50, 50, 49, 50, 50, 50, 49, 50, 50, 50, 50] },
  { rank: 7, symbol: "XRP", name: "XRP", price: "$0.5238", change: -1.38, marketCap: "$28.9B", volume: "$1.4B", category: "Layer 1", color: "#23292F", spark: [63, 61, 62, 59, 60, 57, 58, 55, 54, 52, 53, 51, 49, 50, 48] },
  { rank: 8, symbol: "DOGE", name: "Dogecoin", price: "$0.1432", change: 4.12, marketCap: "$20.7B", volume: "$1.8B", category: "Meme", color: "#C2A633", spark: [37, 38, 41, 40, 43, 47, 45, 49, 51, 50, 54, 57, 56, 60, 64] },
  { rank: 9, symbol: "TON", name: "Toncoin", price: "$6.84", change: 2.18, marketCap: "$16.8B", volume: "$411M", category: "Layer 1", color: "#0098EA", spark: [39, 41, 40, 42, 44, 43, 46, 48, 47, 50, 51, 50, 53, 55, 57] },
  { rank: 10, symbol: "ADA", name: "Cardano", price: "$0.3884", change: -2.64, marketCap: "$13.9B", volume: "$336M", category: "Layer 1", color: "#0033AD", spark: [65, 64, 62, 63, 60, 58, 59, 56, 55, 53, 54, 50, 49, 47, 45] },
  { rank: 11, symbol: "AVAX", name: "Avalanche", price: "$36.14", change: 3.64, marketCap: "$14.2B", volume: "$742M", category: "Layer 1", color: "#E84142", spark: [42, 44, 43, 47, 49, 48, 52, 51, 54, 55, 58, 57, 61, 62, 66] },
  { rank: 12, symbol: "SHIB", name: "Shiba Inu", price: "$0.000017", change: 6.72, marketCap: "$10.0B", volume: "$645M", category: "Meme", color: "#F00500", spark: [29, 31, 33, 32, 37, 40, 39, 44, 43, 48, 51, 53, 57, 60, 66] },
  { rank: 13, symbol: "LINK", name: "Chainlink", price: "$14.37", change: -0.24, marketCap: "$8.7B", volume: "$328M", category: "DeFi", color: "#2A5ADA", spark: [52, 53, 51, 52, 50, 51, 49, 50, 48, 49, 48, 47, 48, 47, 48] },
  { rank: 14, symbol: "DOT", name: "Polkadot", price: "$5.91", change: -3.18, marketCap: "$8.6B", volume: "$205M", category: "Layer 1", color: "#E6007A", spark: [66, 64, 63, 61, 60, 58, 57, 55, 54, 52, 50, 51, 48, 46, 43] },
  { rank: 15, symbol: "NEAR", name: "NEAR Protocol", price: "$5.84", change: 5.87, marketCap: "$6.9B", volume: "$478M", category: "AI", color: "#111111", spark: [31, 34, 33, 38, 39, 42, 41, 46, 48, 47, 52, 55, 57, 61, 68] },
  { rank: 16, symbol: "UNI", name: "Uniswap", price: "$9.48", change: 1.94, marketCap: "$5.7B", volume: "$189M", category: "DeFi", color: "#FF007A", spark: [42, 43, 45, 44, 46, 48, 47, 49, 51, 50, 52, 54, 53, 56, 58] },
  { rank: 17, symbol: "APT", name: "Aptos", price: "$6.72", change: -4.26, marketCap: "$3.5B", volume: "$214M", category: "Layer 1", color: "#111111", spark: [64, 62, 63, 59, 57, 58, 54, 52, 50, 48, 49, 46, 44, 42, 39] },
  { rank: 18, symbol: "INJ", name: "Injective", price: "$20.31", change: 8.46, marketCap: "$1.9B", volume: "$331M", category: "DeFi", color: "#00F2EA", spark: [25, 28, 31, 30, 36, 39, 43, 42, 49, 52, 56, 58, 63, 67, 74] },
];

const tabs = ["All assets", "Layer 1", "DeFi", "Meme", "AI", "Stablecoin"];
const navItems = ["Cryptocurrencies", "Categories", "Exchanges", "Learn"];

function Sparkline({ values, tone = "positive", large = false }: { values: number[]; tone?: "positive" | "negative" | "neutral"; large?: boolean }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const path = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 28 - ((value - min) / (max - min || 1)) * 22;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const stroke = tone === "negative" ? "#D95D5D" : tone === "neutral" ? "#8290A3" : "#16A673";
  return <svg className={large ? "sparkline sparkline-large" : "sparkline"} viewBox="0 0 100 32" role="img" aria-label={`${tone} trend sparkline`}><path d={path} fill="none" stroke={stroke} strokeWidth={large ? "1.7" : "1.45"} vectorEffect="non-scaling-stroke" strokeLinecap="round" /></svg>;
}

function ChangeValue({ value }: { value: number }) {
  const positive = value >= 0;
  return <span className={positive ? "change-value is-positive" : "change-value is-negative"}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{Math.abs(value).toFixed(2)}%</span>;
}

function CoinGlyph({ coin, small = false }: { coin: Coin; small?: boolean }) {
  return <span className={`coin-glyph ${small ? "coin-glyph-small" : ""}`} style={{ background: `${coin.color}16`, color: coin.color, borderColor: `${coin.color}45` }}>{coin.symbol.slice(0, 1)}</span>;
}

function MovementCard({ title, subtitle, items, tone }: { title: string; subtitle: string; items: Coin[]; tone: "positive" | "negative" }) {
  return <article className="movement-card">
    <div className="movement-card-head"><div><span className={`movement-indicator ${tone}`} /> <span className="card-overline">{title}</span><p>{subtitle}</p></div><button className="card-link" onClick={() => toast(`${title} ranking selected`, { description: "The full ranking view will be available with live market data." })}>View all <ChevronRight size={14} /></button></div>
    <div className="movement-list">{items.map((coin, index) => <div className="movement-row" key={coin.symbol}>
      <span className="movement-rank">{String(index + 1).padStart(2, "0")}</span>
      <CoinGlyph coin={coin} small />
      <div className="movement-asset"><strong>{coin.symbol}</strong><span>{coin.name}</span></div>
      <span className="movement-price">{coin.price}</span>
      <Sparkline values={coin.spark} tone={tone} />
      <ChangeValue value={coin.change} />
    </div>)}</div>
  </article>;
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Cryptocurrencies");
  const [activeTab, setActiveTab] = useState("All assets");
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState<Set<string>>(() => new Set(["BTC", "ETH", "INJ"]));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const gainers = useMemo(() => [...coins].filter((coin) => coin.change > 0).sort((a, b) => b.change - a.change).slice(0, 4), []);
  const decliners = useMemo(() => [...coins].filter((coin) => coin.change < 0).sort((a, b) => a.change - b.change).slice(0, 4), []);
  const visibleCoins = useMemo(() => {
    const query = search.trim().toLowerCase();
    return coins.filter((coin) => {
      const matchesQuery = !query || coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query);
      const matchesTab = activeTab === "All assets" || coin.category === activeTab;
      const matchesWatchlist = activeNav !== "Watchlist" || watchlist.has(coin.symbol);
      return matchesQuery && matchesTab && matchesWatchlist;
    });
  }, [activeNav, activeTab, search, watchlist]);

  function handleNav(label: string) {
    if (label === "Watchlist") {
      setActiveNav(label);
      setMobileMenuOpen(false);
      return;
    }
    setActiveNav(label);
    setMobileMenuOpen(false);
    if (label !== "Cryptocurrencies") toast(`${label} is coming soon`, { description: "The market overview stays available while this section is being prepared." });
  }

  function toggleWatchlist(symbol: string) {
    setWatchlist((current) => {
      const next = new Set(current);
      if (next.has(symbol)) {
        next.delete(symbol);
        toast(`${symbol} removed from watchlist`);
      } else {
        next.add(symbol);
        toast(`${symbol} added to watchlist`, { description: "Your saved assets appear in the watchlist view." });
      }
      return next;
    });
  }

  return <div className="light-app-shell">
    <header className="site-header">
      <div className="header-inner">
        <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
        <div className="brand-lockup"><span className="brand-mark-box"><img src={mark} alt="" /></span><span className="brand-wordmark">CryptoLens</span><span className="brand-tagline">MARKET</span></div>
        <nav className={`main-nav ${mobileMenuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <button className="mobile-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"><X size={18} /></button>
          {navItems.map((item) => <button key={item} className={activeNav === item ? "is-active" : ""} onClick={() => handleNav(item)}>{item}</button>)}
          <button className={activeNav === "Watchlist" ? "is-active" : ""} onClick={() => handleNav("Watchlist")}><Bookmark size={14} /> Watchlist <span className="nav-badge">{watchlist.size}</span></button>
        </nav>
        <div className="header-actions"><label className="global-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" aria-label="Search cryptocurrencies" /></label><button className="header-icon" onClick={() => toast("No new alerts", { description: "Market alerts will appear here." })} aria-label="Notifications"><Bell size={17} /></button><button className="header-icon" onClick={() => toast("Wallet preview coming soon")} aria-label="Wallet"><WalletCards size={17} /></button><button className="header-button" onClick={() => toast("Sign in preview", { description: "Authentication can be connected in the next step." })}>Sign in</button></div>
      </div>
    </header>

    <div className="market-ticker"><div className="ticker-inner"><span><strong>Cryptos</strong> 14,812</span><span><strong>Market cap</strong> $2.41T <em>+1.84%</em></span><span><strong>24h volume</strong> $84.6B <em>+6.21%</em></span><span><strong>BTC dominance</strong> 52.7%</span><span className="ticker-updated">Data updated 12:48 UTC</span></div></div>

    <main className="market-page">
      <section className="market-hero">
        <div><div className="page-overline"><span className="status-dot-light" /> MARKET OVERVIEW <span>•</span> 12 AUG 2026</div><h1>Cryptocurrency market overview</h1><p>Explore prices, market cap, volume, and 24-hour performance across the market.</p></div>
        <div className="hero-total"><span>Total market cap</span><strong>$2.41T</strong><ChangeValue value={1.84} /><small>+ $43.6B in the last 24 hours</small></div>
      </section>

      <section className="metric-grid" aria-label="Market summary">
        <article className="light-metric-card"><div><span>Market cap</span><CircleHelp size={15} /></div><strong>$2.41T</strong><ChangeValue value={1.84} /><small>Global crypto market</small></article>
        <article className="light-metric-card"><div><span>24h volume</span><LineChart size={15} /></div><strong>$84.6B</strong><ChangeValue value={6.21} /><small>Trading activity</small></article>
        <article className="light-metric-card"><div><span>BTC dominance</span><TrendingUp size={15} /></div><strong>52.7%</strong><ChangeValue value={-0.48} /><small>Share of total market</small></article>
        <article className="light-metric-card"><div><span>Fear &amp; greed</span><strong className="metric-score">68</strong></div><div className="fear-bar"><span /></div><strong className="metric-label">Greed</strong><small>+4 from yesterday</small></article>
      </section>

      <section className="movement-grid" aria-label="24 hour market rankings"><MovementCard title="Top gainers" subtitle="Leading assets by 24h change" items={gainers} tone="positive" /><MovementCard title="Top decliners" subtitle="Largest pullbacks by 24h change" items={decliners} tone="negative" /><article className="insight-card" style={{ backgroundImage: `linear-gradient(112deg, rgba(255, 255, 255, 0.98) 0%, rgba(238, 246, 255, 0.88) 100%), url(${signalTexture})` }}><div className="insight-head"><span className="card-overline">MARKET INSIGHT</span><span className="insight-number">01</span></div><h2>Risk is rotating,<br /><em>not leaving.</em></h2><p>Large caps are holding while selected AI and DeFi names widen the 24-hour breadth.</p><button className="card-link" onClick={() => toast("Insight detail coming soon", { description: "A deeper market narrative will be available with the research module." })}>Read the brief <ChevronRight size={14} /></button></article></section>

      <section className="table-section">
        <div className="section-heading"><div><div className="page-overline">MARKET RANKINGS <span>•</span> 24H SNAPSHOT</div><h2>{activeNav === "Watchlist" ? "Your watchlist" : "All cryptocurrencies"}</h2></div><button className="outline-button" onClick={() => toast("Currency converter coming soon")}>USD <ChevronDown size={14} /></button></div>
        <div className="table-controls"><div className="asset-tabs" role="tablist" aria-label="Asset category filters">{tabs.map((tab) => <button key={tab} className={activeTab === tab ? "is-selected" : ""} onClick={() => { setActiveTab(tab); setActiveNav("Cryptocurrencies"); }} role="tab" aria-selected={activeTab === tab}>{tab}</button>)}</div><div className="control-actions"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search coins" aria-label="Search coins in market rankings" /></label><button className="filter-button" onClick={() => toast("Filter menu coming soon", { description: "Use the category tabs and search for now." })}><Filter size={15} /> Filters</button></div></div>
        <div className="ranking-table-wrap"><div className="ranking-table" role="table" aria-label="Cryptocurrency rankings"><div className="ranking-row ranking-header" role="row"><span>#</span><span>Name</span><span>Price</span><span>24h</span><span>7d chart</span><span>Market cap</span><span>Volume 24h</span><span /></div>{visibleCoins.length ? visibleCoins.map((coin) => <div className="ranking-row" role="row" key={coin.symbol}><span className="rank-number">{coin.rank}</span><div className="ranking-asset"><button className={`star-button ${watchlist.has(coin.symbol) ? "is-saved" : ""}`} onClick={() => toggleWatchlist(coin.symbol)} aria-label={`${watchlist.has(coin.symbol) ? "Remove" : "Add"} ${coin.name} ${watchlist.has(coin.symbol) ? "from" : "to"} watchlist`} aria-pressed={watchlist.has(coin.symbol)}><Star size={15} fill={watchlist.has(coin.symbol) ? "currentColor" : "none"} /></button><CoinGlyph coin={coin} /><div><strong>{coin.name}</strong><span>{coin.symbol}</span></div></div><strong className="ranking-price">{coin.price}</strong><ChangeValue value={coin.change} /><Sparkline values={coin.spark} tone={coin.change < 0 ? "negative" : coin.change === 0 ? "neutral" : "positive"} /><span className="ranking-value">{coin.marketCap}</span><span className="ranking-value volume-value">{coin.volume}</span><button className="row-menu" onClick={() => toast(`${coin.name} selected`, { description: "Coin detail pages are next on the roadmap." })} aria-label={`Open ${coin.name} details`}><ChevronRight size={16} /></button></div>) : <div className="empty-ranking"><Search size={18} /><strong>No coins found</strong><span>Try another ticker, name, or category.</span><button className="clear-button" onClick={() => { setSearch(""); setActiveTab("All assets"); }}>Clear search</button></div>}</div></div>
        <div className="table-summary"><span><span className="status-dot-light" /> Illustrative market data • API-ready surface</span><span>Showing {visibleCoins.length} of {coins.length} assets</span></div>
      </section>

      <section className="watchlist-section"><div className="watchlist-heading"><div><div className="page-overline">YOUR WATCHLIST</div><h2>Assets you are tracking</h2></div><button className="card-link" onClick={() => handleNav("Watchlist")}>Open watchlist <ChevronRight size={14} /></button></div><div className="watchlist-grid">{coins.filter((coin) => watchlist.has(coin.symbol)).map((coin) => <article className="light-watch-card" key={coin.symbol}><div className="light-watch-head"><div className="ranking-asset"><CoinGlyph coin={coin} small /><div><strong>{coin.symbol}</strong><span>{coin.name}</span></div></div><button className="star-button is-saved" onClick={() => toggleWatchlist(coin.symbol)} aria-label={`Remove ${coin.name} from watchlist`}><Star size={15} fill="currentColor" /></button></div><div className="watch-value"><strong>{coin.price}</strong><ChangeValue value={coin.change} /></div><Sparkline values={coin.spark} tone={coin.change < 0 ? "negative" : "positive"} large /><div className="watch-meta"><span>MCAP {coin.marketCap}</span><span>VOL {coin.volume}</span></div></article>)}</div></section>

      <footer className="light-footer"><span>© 2026 CryptoLens Market</span><span>Prices are illustrative • Not financial advice</span><span className="footer-brand"><img src={mark} alt="" /> Clearer market context</span></footer>
    </main>
  </div>;
}
