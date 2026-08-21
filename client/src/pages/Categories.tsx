import { ArrowDownRight, ArrowUpRight, ChevronRight, Layers3, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";
import { formatCompactUsd, formatPercent, formatUpdated } from "@/lib/marketFormat";
import { trpc } from "@/lib/trpc";

export default function Categories() {
  const categories = trpc.market.categories.useQuery(undefined, { staleTime: 15_000, refetchInterval: 20_000, retry: 1 });
  return <div className="light-app-shell"><MarketHeader active="categories" /><main className="data-page">
    <section className="data-page-head"><div><div className="page-overline"><span className="status-dot-light" /> LIVE MARKET TAXONOMY</div><h1>Crypto categories</h1><p>Compare the market size and 24-hour movement of the major sectors shaping crypto activity.</p></div><div className="page-status"><span className={categories.isFetching ? "status-pulse is-refreshing" : "status-pulse"} /><span>{categories.data ? `CoinGecko Demo API · ${formatUpdated(new Date().toISOString())}` : "Connecting to provider"}</span></div></section>
    {categories.isError ? <section className="market-error"><Layers3 size={22} /><div><strong>Categories are temporarily unavailable.</strong><p>{categories.error.message || "The provider did not return a usable response. Try refreshing the page."}</p></div><button className="outline-button" onClick={() => categories.refetch()}><RefreshCw size={14} /> Retry</button></section> : <section className="category-grid">{(categories.data ?? Array.from({ length: 12 })).map((category, index) => category ? <article className="category-card" key={category.id}><div className="category-card-top"><span className="category-rank">{String(index + 1).padStart(2, "0")}</span><span className={category.change24h >= 0 ? "category-change is-positive" : "category-change is-negative"}>{category.change24h >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{formatPercent(category.change24h)}</span></div><h2>{category.name}</h2><strong>{formatCompactUsd(category.marketCap)}</strong><span className="category-label">Category market cap</span><div className="category-logos" aria-label={`${category.topCoinCount} leading assets`}><span className="category-logo-orb">{category.topCoinCount}</span><span className="category-logo-label">tracked leaders</span></div><Link href={`/?category=${category.id}`} className="category-link">Open category <ChevronRight size={14} /></Link></article> : <article className="category-card category-skeleton" key={index}><span /><span /><span /></article>)}</section>}
    <MarketFooter />
  </main></div>;
}
