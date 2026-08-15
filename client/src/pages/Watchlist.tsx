import { useMemo } from "react";
import { Bookmark, ChevronRight, CircleAlert, LineChart, Loader2, Star } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";
import { startLogin } from "@/const";
import { formatCompactUsd, formatPercent, formatUsd } from "@/lib/marketFormat";
import { trpc } from "@/lib/trpc";

export default function Watchlist() {
  const { isAuthenticated, loading } = useAuth();
  const saved = trpc.watchlist.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const market = trpc.market.snapshot.useQuery(undefined, { enabled: isAuthenticated, staleTime: 15_000, refetchInterval: 20_000, retry: false });
  const utils = trpc.useUtils();
  const remove = trpc.watchlist.remove.useMutation({ onSuccess: () => utils.watchlist.list.invalidate() });
  const savedIds = useMemo(() => new Set(saved.data?.map((entry) => entry.coinId) ?? []), [saved.data]);
  const coins = market.data?.coins.filter((coin) => savedIds.has(coin.id)) ?? [];

  if (loading) return <div className="light-app-shell"><MarketHeader active="watchlist" /><main className="data-page"><section className="watchlist-loading"><Loader2 size={18} className="spin" /> Checking your account…</section><MarketFooter /></main></div>;
  if (!isAuthenticated) return <div className="light-app-shell"><MarketHeader active="watchlist" /><main className="data-page"><section className="empty-watchlist account-gate"><Bookmark size={28} /><div className="page-overline">PERSONAL MARKET WORKSPACE</div><h1>Sign in to save live assets.</h1><p>Your account keeps saved coins separate from market data, so the list can follow you across devices.</p><button className="header-button" onClick={startLogin}>Sign in with Manus</button><Link href="/" className="text-link">Browse live rankings <ChevronRight size={14} /></Link></section><MarketFooter /></main></div>;

  return <div className="light-app-shell"><MarketHeader active="watchlist" watchCount={saved.data?.length ?? 0} /><main className="data-page"><section className="watchlist-page-head"><div><div className="page-overline">YOUR SAVED ASSETS</div><h1>Watchlist</h1><p>Live values refresh from the aggregated market feed. Remove an asset at any time.</p></div><div className="watchlist-summary"><span>Assets saved</span><strong>{saved.data?.length ?? 0}</strong></div></section>{saved.isLoading || market.isLoading ? <section className="watchlist-loading"><Loader2 size={18} className="spin" /> Loading your live watchlist…</section> : saved.isError || market.isError ? <section className="watchlist-error"><CircleAlert size={19} /><div><strong>Watchlist data is temporarily unavailable.</strong><span>Try refreshing the page or return to the market screen.</span></div></section> : !coins.length ? <section className="empty-watchlist"><Star size={27} /><div className="page-overline">NO SAVED ASSETS YET</div><h1>Build your market shortlist.</h1><p>Open any coin from the live rankings and select Save to watchlist.</p><Link href="/" className="header-button">Explore markets</Link></section> : <section className="watchlist-list" aria-label="Saved cryptocurrency assets">{coins.map((coin) => <article className="watchlist-row" key={coin.id}><Link href={`/coin/${coin.id}`} className="watchlist-identity"><span className="watchlist-coin-icon">{coin.image ? <img src={coin.image} alt="" /> : coin.symbol.slice(0, 1)}</span><span><strong>{coin.name}</strong><small>{coin.symbol}</small></span></Link><div><span>Price</span><strong>{formatUsd(coin.price)}</strong></div><div><span>24h</span><strong className={coin.change24h >= 0 ? "is-up" : "is-down"}>{formatPercent(coin.change24h)}</strong></div><div><span>Market cap</span><strong>{formatCompactUsd(coin.marketCap)}</strong></div><div><span>Volume</span><strong>{formatCompactUsd(coin.volume)}</strong></div><Link href={`/coin/${coin.id}`} className="watch-open"><LineChart size={16} /></Link><button className="watch-remove" onClick={() => remove.mutate({ coinId: coin.id })} disabled={remove.isPending} aria-label={`Remove ${coin.name} from watchlist`}><Star size={16} fill="currentColor" /></button></article>)}</section>}<MarketFooter /></main></div>;
}
