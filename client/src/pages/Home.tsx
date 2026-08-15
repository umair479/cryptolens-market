import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Filter, LineChart, RefreshCw, Search, Star, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";
import { startLogin } from "@/const";
import { formatCompactUsd, formatPercent, formatUpdated, formatUsd } from "@/lib/marketFormat";
import { trpc } from "@/lib/trpc";

type LiveCoin = { id: string; rank: number; symbol: string; name: string; image?: string; price: number; marketCap: number; volume: number; change1h: number | null; change24h: number; change7d: number | null; sparkline: number[] };
type Board = "all" | "gainers" | "decliners" | "watchlist";
type Segment = "all" | "large" | "mid" | "volume";
type CategoryOption = { id: string; name: string };

const PAGE_SIZE = 25;
const researchCards = [
  { eyebrow: "Market reading", title: "Do large moves arrive with liquidity?", copy: "Use the gainer table with volume and market-cap context before treating a percentage change as a signal.", href: "/learn" },
  { eyebrow: "Asset research", title: "What belongs on a coin detail page?", copy: "Price, supply, all-time range, market cap, and official project links should be read together, not in isolation.", href: "/coin/bitcoin" },
  { eyebrow: "Source awareness", title: "Keep exchange and global feeds distinct.", copy: "CryptoLens shows provider labels because venue-specific activity and global aggregation answer different questions.", href: "/exchanges" },
];

function Sparkline({ values, tone = "positive", large = false }: { values: number[]; tone?: "positive" | "negative" | "neutral"; large?: boolean }) {
  const safeValues = values.length > 1 ? values : [0, 0];
  const min = Math.min(...safeValues);
  const max = Math.max(...safeValues);
  const path = safeValues.map((value, index) => { const x = (index / (safeValues.length - 1)) * 100; const y = 28 - ((value - min) / (max - min || 1)) * 22; return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ");
  const stroke = tone === "negative" ? "#D95D5D" : tone === "neutral" ? "#8290A3" : "#16A673";
  return <svg className={large ? "sparkline sparkline-large" : "sparkline"} viewBox="0 0 100 32" role="img" aria-label={`${tone} trend sparkline`}><path d={path} fill="none" stroke={stroke} strokeWidth={large ? "1.7" : "1.45"} vectorEffect="non-scaling-stroke" strokeLinecap="round" /></svg>;
}

function ChangeValue({ value }: { value: number | null }) {
  if (value === null) return <span className="change-value is-neutral">—</span>;
  const positive = value >= 0;
  return <span className={positive ? "change-value is-positive" : "change-value is-negative"}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{formatPercent(value)}</span>;
}

function CoinGlyph({ coin, small = false }: { coin: LiveCoin; small?: boolean }) {
  return <Link href={`/coin/${coin.id}`} className={`coin-glyph ${small ? "coin-glyph-small" : ""}`} aria-label={`Open ${coin.name} details`}>{coin.image ? <img src={coin.image} alt="" /> : coin.symbol.slice(0, 1)}</Link>;
}

function MoverCard({ title, subtitle, coins, tone, onOpen }: { title: string; subtitle: string; coins: LiveCoin[]; tone: "positive" | "negative"; onOpen: () => void }) {
  return <article className="movement-card"><div className="movement-card-head"><div><span className={`movement-indicator ${tone}`} /> <span className="card-overline">{title}</span><p>{subtitle}</p></div><button className="card-link" onClick={onOpen}>Top 20 <ChevronRight size={14} /></button></div><div className="movement-list">{coins.slice(0, 4).map((coin, index) => <div className="movement-row" key={coin.id}><span className="movement-rank">{String(index + 1).padStart(2, "0")}</span><CoinGlyph coin={coin} small /><Link href={`/coin/${coin.id}`} className="movement-asset"><strong>{coin.symbol}</strong><span>{coin.name}</span></Link><span className="movement-price">{formatUsd(coin.price)}</span><Sparkline values={coin.sparkline} tone={tone} /><ChangeValue value={coin.change24h} /></div>)}</div></article>;
}

type RankingSurfaceProps = {
  board: Board;
  setBoard: (value: Board) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  categories: CategoryOption[];
  segment: Segment;
  setSegment: (value: Segment) => void;
  search: string;
  setSearch: (value: string) => void;
  loading: boolean;
  coins: LiveCoin[];
  savedIds: Set<string>;
  onToggleWatchlist: (coin: LiveCoin) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  filteredCount: number;
  sourceLabel: string;
};

function RankingSurface({ board, setBoard, categoryId, setCategoryId, categories, segment, setSegment, search, setSearch, loading, coins, savedIds, onToggleWatchlist, page, setPage, totalPages, filteredCount, sourceLabel }: RankingSurfaceProps) {
  const [sortKey, setSortKey] = useState<"rank" | "marketCap" | "volume" | "change1h" | "change24h" | "change7d">("rank");
  const [descending, setDescending] = useState(false);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({ hour: true, week: true, volume: true });
  const categoryName = categoryId === "all" ? "All cryptocurrencies" : categories.find((category) => category.id === categoryId)?.name ?? "Category assets";
  const sortedCoins = useMemo(() => [...coins].sort((left, right) => {
    const leftValue = left[sortKey] ?? 0;
    const rightValue = right[sortKey] ?? 0;
    return descending ? Number(rightValue) - Number(leftValue) : Number(leftValue) - Number(rightValue);
  }), [coins, descending, sortKey]);
  const denseColumns = ["30px", "minmax(195px,1.55fr)", "100px", visibleColumns.hour ? "62px" : null, "62px", visibleColumns.week ? "62px" : null, "106px", visibleColumns.volume ? "100px" : null, "98px", "28px"].filter(Boolean).join(" ");
  const gridStyle = { gridTemplateColumns: denseColumns };
  const toggleColumn = (key: "hour" | "week" | "volume") => setVisibleColumns((current) => ({ ...current, [key]: !current[key] }));
  return <section className="table-section" id="live-rankings">
    <div className="section-heading"><div><div className="page-overline">LIVE RANKINGS <span>•</span> {board.toUpperCase()}</div><h2>{board === "gainers" ? "Top 20 gainers" : board === "decliners" ? "Top 20 decliners" : board === "watchlist" ? "Your saved assets" : categoryName}</h2></div><button className="outline-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>USD <ChevronDown size={14} /></button></div>
    <div className="table-controls"><div className="asset-tabs" role="tablist" aria-label="Market ranking filters">{([ ["all", "All assets"], ["gainers", "Top gainers"], ["decliners", "Top decliners"], ["watchlist", "Saved"] ] as const).map(([value, label]) => <button key={value} className={board === value ? "is-selected" : ""} onClick={() => setBoard(value)} role="tab" aria-selected={board === value}>{label}</button>)}</div><div className="control-actions"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search coins" aria-label="Search coins in market rankings" /></label><label className="sort-control"><span>Sort</span><select value={sortKey} onChange={(event) => setSortKey(event.target.value as typeof sortKey)}><option value="rank">Rank</option><option value="marketCap">Market cap</option><option value="volume">Volume</option><option value="change1h">1h change</option><option value="change24h">24h change</option><option value="change7d">7d change</option></select></label><button className="filter-button" onClick={() => setDescending((current) => !current)}>{descending ? "High → low" : "Low → high"}</button><div className="table-column-control"><button className="filter-button" onClick={() => setColumnMenuOpen((current) => !current)} aria-expanded={columnMenuOpen}>Columns <ChevronDown size={14} /></button>{columnMenuOpen && <div className="column-menu"><label><input type="checkbox" checked={visibleColumns.hour} onChange={() => toggleColumn("hour")} /> 1h change</label><label><input type="checkbox" checked={visibleColumns.week} onChange={() => toggleColumn("week")} /> 7d change</label><label><input type="checkbox" checked={visibleColumns.volume} onChange={() => toggleColumn("volume")} /> 24h volume</label></div>}</div></div></div>
    <div className="market-segments" aria-label="Market segments">{([ ["all", "All market"], ["large", "Top 25"], ["mid", "Ranks 26–100"], ["volume", "Volume leaders"] ] as const).map(([value, label]) => <button key={value} className={segment === value ? "is-selected" : ""} onClick={() => setSegment(value)}>{label}</button>)}</div>
    <div className="category-filter-row" aria-label="Live market categories"><span>Category</span><button className={categoryId === "all" ? "is-selected" : ""} onClick={() => setCategoryId("all")}>All</button>{categories.slice(0, 7).map((category) => <button key={category.id} className={categoryId === category.id ? "is-selected" : ""} onClick={() => setCategoryId(category.id)}>{category.name}</button>)}</div>
    <div className="ranking-table-wrap"><div className="ranking-table ranking-table-dense" role="table" aria-label="Live cryptocurrency rankings"><div className="ranking-row ranking-row-dense ranking-header" style={gridStyle} role="row"><span>#</span><span>Name</span><span>Price</span>{visibleColumns.hour && <span>1h</span>}<span>24h</span>{visibleColumns.week && <span>7d</span>}<span>Market cap</span>{visibleColumns.volume && <span>Volume 24h</span>}<span>Last 7 days</span><span /></div>{loading ? Array.from({ length: 12 }).map((_, index) => <div className="ranking-row ranking-row-dense ranking-loading" style={gridStyle} key={index}>{Array.from({ length: 10 - Number(!visibleColumns.hour) - Number(!visibleColumns.week) - Number(!visibleColumns.volume) }, (_, cell) => <span key={cell} />)}</div>) : sortedCoins.map((coin) => <div className="ranking-row ranking-row-dense" style={gridStyle} role="row" key={coin.id}><span className="rank-number">{coin.rank}</span><div className="ranking-asset"><button className={`star-button ${savedIds.has(coin.id) ? "is-saved" : ""}`} onClick={() => onToggleWatchlist(coin)} aria-label={`${savedIds.has(coin.id) ? "Remove" : "Add"} ${coin.name} ${savedIds.has(coin.id) ? "from" : "to"} watchlist`} aria-pressed={savedIds.has(coin.id)}><Star size={15} fill={savedIds.has(coin.id) ? "currentColor" : "none"} /></button><CoinGlyph coin={coin} /><Link href={`/coin/${coin.id}`} className="ranking-asset-link"><strong>{coin.name}</strong><span>{coin.symbol}</span></Link></div><strong className="ranking-price">{formatUsd(coin.price)}</strong>{visibleColumns.hour && <ChangeValue value={coin.change1h} />}<ChangeValue value={coin.change24h} />{visibleColumns.week && <ChangeValue value={coin.change7d} />}<span className="ranking-value">{formatCompactUsd(coin.marketCap)}</span>{visibleColumns.volume && <span className="ranking-value volume-value">{formatCompactUsd(coin.volume)}</span>}<Sparkline values={coin.sparkline} tone={coin.change24h < 0 ? "negative" : "positive"} /><Link href={`/coin/${coin.id}`} className="row-menu" aria-label={`Open ${coin.name} details`}><ChevronRight size={16} /></Link></div>)}{!loading && !coins.length && <div className="empty-ranking"><Search size={18} /><strong>No matching live assets</strong><span>Try a new ticker, clear the search, or switch the table filter.</span><button className="clear-button" onClick={() => { setSearch(""); setBoard("all"); setSegment("all"); setCategoryId("all"); }}>Clear filters</button></div>}</div></div>
    <div className="ranking-pagination"><span>Showing {filteredCount ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filteredCount)} of {filteredCount} assets</span><div><button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page"><ChevronLeft size={15} /></button>{Array.from({ length: Math.min(totalPages, 4) }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} onClick={() => setPage(pageNumber)} className={page === pageNumber ? "is-current" : ""}>{pageNumber}</button>)}{totalPages > 4 && <span>…</span>}<button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Next page"><ChevronRight size={15} /></button></div></div>
    <div className="table-summary"><span><span className="status-dot-light" /> Data through {sourceLabel}</span><span>{loading ? "Refreshing cached market data…" : `Live snapshot • Page ${page} of ${totalPages}`}</span></div>
  </section>;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [board, setBoard] = useState<Board>("all");
  const [segment, setSegment] = useState<Segment>("all");
  const [categoryId, setCategoryId] = useState(() => typeof window === "undefined" ? "all" : new URLSearchParams(window.location.search).get("category") || "all");
  const [page, setPage] = useState(1);
  const { isAuthenticated } = useAuth();
  const market = trpc.market.snapshot.useQuery(undefined, { staleTime: 15_000, refetchInterval: 20_000, retry: 1 });
  const categories = trpc.market.categories.useQuery(undefined, { staleTime: 15_000, refetchInterval: 20_000, retry: false });
  const categoryMarket = trpc.market.categoryCoins.useQuery({ categoryId }, { enabled: categoryId !== "all", staleTime: 15_000, refetchInterval: 20_000, retry: false });
  const savedAssets = trpc.watchlist.list.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30_000, retry: false });
  const utils = trpc.useUtils();
  const addToWatchlist = trpc.watchlist.add.useMutation({ onSuccess: () => utils.watchlist.list.invalidate() });
  const removeFromWatchlist = trpc.watchlist.remove.useMutation({ onSuccess: () => utils.watchlist.list.invalidate() });
  const data = market.data;
  const savedIds = useMemo(() => new Set(savedAssets.data?.map((entry) => entry.coinId) ?? []), [savedAssets.data]);

  const filteredCoins = useMemo(() => {
    const liveCategoryCoins = categoryId === "all" ? null : categoryMarket.data?.coins ?? [];
    let pool = liveCategoryCoins ?? (board === "gainers" ? data?.gainers ?? [] : board === "decliners" ? data?.decliners ?? [] : data?.coins ?? []);
    if (liveCategoryCoins && board === "gainers") pool = [...pool].filter((coin) => coin.change24h > 0).sort((left, right) => right.change24h - left.change24h);
    if (liveCategoryCoins && board === "decliners") pool = [...pool].filter((coin) => coin.change24h < 0).sort((left, right) => left.change24h - right.change24h);
    const normalizedSearch = search.trim().toLowerCase();
    let next = pool.filter((coin) => (board !== "watchlist" || savedIds.has(coin.id)) && (!normalizedSearch || coin.name.toLowerCase().includes(normalizedSearch) || coin.symbol.toLowerCase().includes(normalizedSearch)));
    if (segment === "large") next = next.filter((coin) => coin.rank <= 25);
    if (segment === "mid") next = next.filter((coin) => coin.rank > 25 && coin.rank <= 100);
    if (segment === "volume") next = [...next].sort((a, b) => b.volume - a.volume);
    return next;
  }, [board, categoryId, categoryMarket.data?.coins, data, savedIds, search, segment]);
  const totalPages = Math.max(1, Math.ceil(filteredCoins.length / PAGE_SIZE));
  const displayedCoins = filteredCoins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const topWatchlist = (data?.coins ?? []).filter((coin) => savedIds.has(coin.id)).slice(0, 3);
  const bitcoin = data?.coins.find((coin) => coin.symbol === "BTC");
  useEffect(() => setPage(1), [board, categoryId, segment, search]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  function selectBoard(next: Board) { setBoard(next); document.getElementById("live-rankings")?.scrollIntoView({ behavior: "smooth" }); }
  function toggleWatchlist(coin: LiveCoin) { if (!isAuthenticated) { startLogin(); return; } if (savedIds.has(coin.id)) removeFromWatchlist.mutate({ coinId: coin.id }); else addToWatchlist.mutate({ coinId: coin.id }); }

  return <div className="light-app-shell"><MarketHeader active="market" search={search} onSearchChange={setSearch} watchCount={savedIds.size} /><div className="market-ticker"><div className="ticker-inner"><span><strong>Global provider</strong> {market.isError ? "Unavailable" : data?.sources.global ?? "Connecting"}</span><span><strong>Binance spot</strong> {data?.binance.status === "live" ? "Live" : "Unavailable"}</span><span><strong>Refresh</strong> {data?.sources.refreshSeconds ?? 60}s</span><span className="ticker-updated">{market.isError ? "Provider error" : `Updated ${formatUpdated(data?.overview.updatedAt)}`}</span></div></div><main className="market-page">
    <section className="market-hero"><div><div className="page-overline"><span className="status-dot-light" /> LIVE MARKET OVERVIEW <span>•</span> MULTI-PROVIDER</div><h1>Crypto market, <em>in context.</em></h1><p>Global rankings, period comparisons, and separate exchange signals in one read-only market workspace.</p></div><div className="hero-total"><span>Tracked market cap</span><strong>{formatCompactUsd(data?.overview.totalMarketCap ?? 0)}</strong><small>{data ? "Computed from the current market universe" : "Connecting to live provider"}</small></div></section>
    {market.isError ? <section className="market-error"><LineChart size={22} /><div><strong>Live market data is temporarily unavailable.</strong><p>{market.error.message || "We could not refresh provider data. The page will recover automatically or you can retry now."}</p></div><button className="outline-button" onClick={() => market.refetch()}><RefreshCw size={14} /> Retry</button></section> : <>
      <section className="metric-grid" aria-label="Market summary"><article className="light-metric-card"><div><span>Tracked market cap</span><CircleHelp size={15} /></div><strong>{formatCompactUsd(data?.overview.totalMarketCap ?? 0)}</strong><small>Global rank universe</small></article><article className="light-metric-card"><div><span>24h volume</span><LineChart size={15} /></div><strong>{formatCompactUsd(data?.overview.totalVolume ?? 0)}</strong><small>Across tracked markets</small></article><article className="light-metric-card"><div><span>BTC dominance</span><TrendingUp size={15} /></div><strong>{data ? `${data.overview.bitcoinDominance.toFixed(1)}%` : "—"}</strong><small>Of tracked market cap</small></article><article className="light-metric-card"><div><span>Data status</span><strong className="metric-score">{market.isFetching ? "SYNC" : "LIVE"}</strong></div><div className="fear-bar"><span style={{ width: market.isFetching ? "44%" : "83%" }} /></div><strong className="metric-label">{data?.binance.status === "live" ? "MULTI-SOURCE" : "GLOBAL"}</strong><small>Updated {formatUpdated(data?.overview.updatedAt)}</small></article></section>
      <section className="market-intel-ribbon" aria-label="Compact live market intelligence"><article><span>BTC 1h</span><strong>{bitcoin ? formatUsd(bitcoin.price) : "—"}</strong><ChangeValue value={bitcoin?.change1h ?? null} /></article><article><span>BTC 24h</span><strong>{bitcoin ? formatPercent(bitcoin.change24h) : "—"}</strong><small>Benchmark movement</small></article><article><span>Active movers</span><strong>{data?.gainers.length ?? 0}</strong><small>Liquidity-screened gainers</small></article><article><span>Exchange coverage</span><strong>{data?.binance.status === "live" && data?.coinbase.status === "live" ? "2 live" : "1 live"}</strong><small>Spot source feeds</small></article></section>
      <section className="movement-grid" aria-label="Top 20 market movers"><MoverCard title="Top gainers" subtitle="Highest 24h change, liquidity-screened" coins={data?.gainers ?? []} tone="positive" onOpen={() => selectBoard("gainers")} /><MoverCard title="Top decliners" subtitle="Largest 24h pullbacks, liquidity-screened" coins={data?.decliners ?? []} tone="negative" onOpen={() => selectBoard("decliners")} /><article className="insight-card"><div className="insight-head"><span className="card-overline">EXCHANGE SPOT PULSE</span><span className="insight-number">{data?.binance.status === "live" && data?.coinbase.status === "live" ? "2 LIVE" : "SYNC"}</span></div><h2>Exchange data,<br /><em>kept distinct.</em></h2><p>Public Binance and Coinbase spot reads stay separate from global aggregation so each market signal keeps its source.</p><div className="mini-pair-list">{(data?.binance.pairs ?? []).slice(0, 2).map((pair) => <span key={`binance-${pair.symbol}`}><strong>BN · {pair.symbol}</strong><ChangeValue value={pair.change24h} /></span>)}{(data?.coinbase.pairs ?? []).slice(0, 2).map((pair) => <span key={`coinbase-${pair.symbol}`}><strong>CB · {pair.symbol}</strong><ChangeValue value={pair.change24h} /></span>)}</div></article></section>
      <RankingSurface board={board} setBoard={setBoard} categoryId={categoryId} setCategoryId={setCategoryId} categories={categories.data ?? []} segment={segment} setSegment={setSegment} search={search} setSearch={setSearch} loading={market.isLoading || (categoryId !== "all" && categoryMarket.isLoading)} coins={displayedCoins} savedIds={savedIds} onToggleWatchlist={toggleWatchlist} page={page} setPage={setPage} totalPages={totalPages} filteredCount={filteredCoins.length} sourceLabel={categoryId === "all" ? data?.sources.global ?? "provider connection" : "CoinGecko category market feed"} />
      <section className="market-research-desk"><div className="section-heading"><div><div className="page-overline">CRYPTOLENS RESEARCH DESK</div><h2>Market notes for the next click.</h2></div><Link href="/learn" className="card-link">Open learning hub <ChevronRight size={14} /></Link></div><div className="research-desk-grid">{researchCards.map((card) => <article key={card.title}><span>{card.eyebrow}</span><h3>{card.title}</h3><p>{card.copy}</p><Link href={card.href}>Explore context <ArrowRight size={13} /></Link></article>)}</div></section>
      <section className="watchlist-section"><div className="watchlist-heading"><div><div className="page-overline">PERSONAL WATCHLIST</div><h2>Assets you are tracking</h2></div><Link href="/watchlist" className="card-link">Open watchlist <ChevronRight size={14} /></Link></div><div className="watchlist-grid">{topWatchlist.length ? topWatchlist.map((coin) => <article className="light-watch-card" key={coin.id}><div className="light-watch-head"><div className="ranking-asset"><CoinGlyph coin={coin} small /><Link href={`/coin/${coin.id}`} className="ranking-asset-link"><strong>{coin.symbol}</strong><span>{coin.name}</span></Link></div><button className="star-button is-saved" onClick={() => toggleWatchlist(coin)} aria-label={`Remove ${coin.name} from watchlist`}><Star size={15} fill="currentColor" /></button></div><div className="watch-value"><strong>{formatUsd(coin.price)}</strong><ChangeValue value={coin.change24h} /></div><Sparkline values={coin.sparkline} tone={coin.change24h < 0 ? "negative" : "positive"} large /><div className="watch-meta"><span>MCAP {formatCompactUsd(coin.marketCap)}</span><span>VOL {formatCompactUsd(coin.volume)}</span></div></article>) : <article className="watchlist-empty-home"><Star size={19} /><div><strong>Save coins to keep context close.</strong><span>Sign in, then use the star in rankings or Save on a coin page.</span></div></article>}</div></section>
    </>}
    <MarketFooter />
  </main></div>;
}
