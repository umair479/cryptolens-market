import { ArrowDownRight, ArrowLeft, ArrowUpRight, BookOpenCheck, Bookmark, CircleAlert, ExternalLink, Globe2, Landmark, RefreshCw, ShieldQuestion } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Link, useRoute } from "wouter";
import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";
import { formatCompactNumber, formatCompactUsd, formatPercent, formatUpdated, formatUsd } from "@/lib/marketFormat";
import { trpc } from "@/lib/trpc";

function Trend({ value }: { value: number }) {
  const positive = value >= 0;
  return <span className={positive ? "change-value is-positive" : "change-value is-negative"}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{formatPercent(value)}</span>;
}

function DetailSparkline({ values, negative }: { values: number[]; negative: boolean }) {
  const safeValues = values.length > 1 ? values : [0, 0];
  const min = Math.min(...safeValues);
  const max = Math.max(...safeValues);
  const path = safeValues.map((value, index) => {
    const x = (index / (safeValues.length - 1)) * 100;
    const y = 43 - ((value - min) / (max - min || 1)) * 35;
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
  return <svg className="detail-sparkline" viewBox="0 0 100 50" role="img" aria-label="Seven day price trend"><path d={path} fill="none" stroke={negative ? "#D95D5D" : "#16A673"} strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" /></svg>;
}

function StatePill({ label, value }: { label: string; value: string }) {
  const className = value === "present" || value === "elevated" ? "is-caution" : value === "documented" || value === "none_stated" || value === "low" ? "is-document" : "is-unknown";
  return <div className="screening-state"><span>{label}</span><strong className={className}>{value.replaceAll("_", " ")}</strong></div>;
}

export default function CoinDetail() {
  const [, params] = useRoute<{ id: string }>("/coin/:id");
  const coinId = params?.id ?? "";
  const { isAuthenticated } = useAuth();
  const detail = trpc.market.coin.useQuery({ id: coinId }, { enabled: Boolean(coinId), staleTime: 45_000, refetchInterval: 60_000, retry: false });
  const utils = trpc.useUtils();
  const saved = trpc.watchlist.list.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30_000, retry: false });
  const addToWatchlist = trpc.watchlist.add.useMutation({ onSuccess: () => utils.watchlist.list.invalidate() });
  const removeFromWatchlist = trpc.watchlist.remove.useMutation({ onSuccess: () => utils.watchlist.list.invalidate() });

  if (detail.isLoading) return <div className="light-app-shell"><MarketHeader active="market" /><main className="data-page"><section className="detail-loading"><span /><span /><span /><span /></section></main></div>;
  if (detail.isError || !detail.data) return <div className="light-app-shell"><MarketHeader active="market" /><main className="data-page"><section className="detail-error"><CircleAlert size={24} /><h1>Coin information is temporarily unavailable.</h1><p>{detail.error?.message || "The market-data provider did not return this asset."}</p><div><Link href="/" className="outline-button"><ArrowLeft size={14} /> Back to markets</Link><button className="header-button" onClick={() => detail.refetch()}><RefreshCw size={14} /> Retry</button></div></section></main></div>;

  const { coin, screening, source } = detail.data;
  const isNegative = coin.change7d < 0;
  const isSaved = saved.data?.some((entry) => entry.coinId === coin.id) ?? false;
  const statusLabel = screening.status === "higher_risk_flags" ? "Higher-risk flags" : screening.status === "needs_scholar_review" ? "Needs scholar review" : "Research incomplete";

  return <div className="light-app-shell"><MarketHeader active="market" /><main className="data-page coin-detail-page">
    <Link href="/" className="detail-back"><ArrowLeft size={14} /> All cryptocurrencies</Link>
    <section className="coin-detail-hero"><div className="coin-detail-identity"><span className="detail-coin-logo">{coin.image ? <img src={coin.image} alt="" /> : coin.symbol.slice(0, 1)}</span><div><div className="page-overline">RANK #{coin.rank ?? "—"} <span>•</span> LIVE MARKET DATA</div><h1>{coin.name} <span>{coin.symbol}</span></h1><div className="detail-tags">{coin.categories.map((category) => <span key={category}>{category}</span>)}</div></div></div><div className="detail-price"><button className={`detail-save ${isSaved ? "is-saved" : ""}`} onClick={() => { if (!isAuthenticated) { startLogin(); return; } if (isSaved) removeFromWatchlist.mutate({ coinId: coin.id }); else addToWatchlist.mutate({ coinId: coin.id }); }} disabled={addToWatchlist.isPending || removeFromWatchlist.isPending}><Bookmark size={13} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Saved" : "Save"}</button><span>Current price</span><strong>{formatUsd(coin.price)}</strong><Trend value={coin.change24h} /><small>Updated {formatUpdated(coin.lastUpdated ?? undefined)}</small></div></section>
    <section className="coin-detail-grid"><div className="coin-detail-main"><article className="detail-chart-card"><div className="detail-card-head"><div><span className="card-overline">7-DAY PRICE CONTEXT</span><h2>{formatUsd(coin.price)}</h2></div><Trend value={coin.change7d} /></div><DetailSparkline values={coin.sparkline} negative={isNegative} /><div className="detail-chart-caption"><span>7d range • live provider data</span><span>{source.name} • refreshes ~{source.refreshSeconds}s</span></div></article>
      <section className="detail-metrics-grid"><article><span>1h change</span><strong>{coin.change1h === null ? "—" : formatPercent(coin.change1h)}</strong><small>Provider reported</small></article><article><span>Market cap</span><strong>{formatCompactUsd(coin.marketCap)}</strong><small>{formatPercent(coin.marketCapChange24h)} 24h</small></article><article><span>24h volume</span><strong>{formatCompactUsd(coin.volume)}</strong><small>Provider reported</small></article><article><span>Fully diluted valuation</span><strong>{coin.fullyDilutedValuation ? formatCompactUsd(coin.fullyDilutedValuation) : "—"}</strong><small>Provider estimate</small></article><article><span>24h range</span><strong>{coin.low24h && coin.high24h ? `${formatUsd(coin.low24h)} – ${formatUsd(coin.high24h)}` : "—"}</strong><small>Low to high</small></article><article><span>All-time high</span><strong>{formatUsd(coin.ath)}</strong><small>{formatPercent(coin.athChange)} from ATH</small></article><article><span>All-time low</span><strong>{formatUsd(coin.atl)}</strong><small>Historical provider data</small></article></section>
      <article className="detail-about-card"><div className="detail-card-head"><div><span className="card-overline">ABOUT {coin.symbol}</span><h2>Project overview</h2></div>{coin.homepage && <a href={coin.homepage} target="_blank" rel="noreferrer" className="external-link">Website <ExternalLink size={13} /></a>}</div><p>{coin.description || `No provider description is available for ${coin.name}. Review the official project materials before relying on an investment thesis.`}</p>{coin.blockchain && <a href={coin.blockchain} target="_blank" rel="noreferrer" className="blockchain-link"><Globe2 size={14} /> Explore the public chain record <ExternalLink size={12} /></a>}</article>
    </div><aside className="coin-detail-side"><article className="supply-card"><span className="card-overline">SUPPLY SNAPSHOT</span><div><span>Circulating supply</span><strong>{coin.circulatingSupply ? `${formatCompactNumber(coin.circulatingSupply)} ${coin.symbol}` : "—"}</strong></div><div><span>Total supply</span><strong>{coin.totalSupply ? `${formatCompactNumber(coin.totalSupply)} ${coin.symbol}` : "—"}</strong></div><div><span>Max supply</span><strong>{coin.maxSupply ? `${formatCompactNumber(coin.maxSupply)} ${coin.symbol}` : "Not set"}</strong></div><p><Landmark size={14} /> Supply data can change and should be checked against official project materials.</p></article>
      <article className="screening-card"><div className="screening-head"><div><span className="card-overline">ISLAMIC-ETHICS SCREEN</span><h2>Research, not a ruling.</h2></div><ShieldQuestion size={21} /></div><span className={`screening-status ${screening.status}`}>{statusLabel}</span><p className="screening-disclaimer">This educational screen is not a fatwa, Shariah certification, or investment recommendation. Ask a qualified scholar to assess the asset and your intended transaction.</p><div className="screening-copy"><h3>Backing and utility</h3><p>{screening.assetBacking}</p><p>{screening.utilitySummary}</p></div><div className="screening-state-grid"><StatePill label="Interest exposure" value={screening.interestExposure} /><StatePill label="Speculation exposure" value={screening.speculationExposure} /><StatePill label="Transparency" value={screening.transparencyState} /></div><div className="screening-evidence"><BookOpenCheck size={15} /><p>{screening.evidenceNote}</p></div>{screening.sourceUrl && <a href={screening.sourceUrl} target="_blank" rel="noreferrer" className="screening-source">Read framework source <ExternalLink size={12} /></a>}</article></aside></section>
    <MarketFooter />
  </main></div>;
}
