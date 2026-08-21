import { useMemo, useState } from "react";
import { Bookmark, ChevronRight, CircleAlert, LineChart, Loader2, Star, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";
import { formatCompactUsd, formatPercent, formatUsd } from "@/lib/marketFormat";
import { trpc } from "@/lib/trpc";

type WatchCoin = { id: string; symbol: string; name: string; image: string | null; price: number; change24h: number; marketCap: number; volume: number };

function WatchCoinIcon({ coin }: { coin: WatchCoin }) {
  const [imgError, setImgError] = useState(false);
  const colors = ["#3861fb","#16a673","#d99a2b","#d95d5d","#7c4dff","#00bcd4"];
  const bg = colors[coin.symbol.charCodeAt(0) % colors.length];
  if (coin.image && !imgError) {
    return <span className="watchlist-coin-icon" style={{ background: "transparent", border: "1px solid #e2e8ef" }}><img src={coin.image} alt={coin.name} width={22} height={22} style={{ borderRadius: "50%", objectFit: "contain" }} onError={() => setImgError(true)} /></span>;
  }
  return <span className="watchlist-coin-icon" style={{ background: bg, color: "#fff", fontWeight: 700 }}>{coin.symbol.slice(0, 1)}</span>;
}

export default function Watchlist() {
  // Show popular coins instead of personal watchlist since auth is disabled
  const market = trpc.market.snapshot.useQuery(undefined, { staleTime: 15_000, refetchInterval: 20_000, retry: false });
  
  // Show top 10 coins as a "featured watchlist"
  const coins = market.data?.coins.slice(0, 10) ?? [];

  return (
    <div className="light-app-shell">
      <MarketHeader active="watchlist" />
      <main className="data-page">
        <section className="watchlist-page-head">
          <div>
            <div className="page-overline">FEATURED CRYPTOCURRENCIES</div>
            <h1>Popular Assets</h1>
            <p>Live values from the aggregated market feed showing the most popular cryptocurrencies.</p>
          </div>
          <div className="watchlist-summary">
            <span>Top assets</span>
            <strong>{coins.length}</strong>
          </div>
        </section>
        
        {market.isLoading ? (
          <section className="watchlist-loading">
            <Loader2 size={18} className="spin" /> Loading popular cryptocurrencies…
          </section>
        ) : market.isError ? (
          <section className="watchlist-error">
            <CircleAlert size={19} />
            <div>
              <strong>Market data is temporarily unavailable.</strong>
              <span>Try refreshing the page.</span>
            </div>
          </section>
        ) : !coins.length ? (
          <section className="empty-watchlist">
            <TrendingUp size={27} />
            <div className="page-overline">LOADING MARKET DATA</div>
            <h1>Fetching live prices...</h1>
            <p>Please wait while we load the latest cryptocurrency market data.</p>
          </section>
        ) : (
          <section className="watchlist-list" aria-label="Popular cryptocurrency assets">
            {coins.map((coin) => (
              <article className="watchlist-row" key={coin.id}>
                <Link href={`/coin/${coin.id}`} className="watchlist-identity">
                  <WatchCoinIcon coin={coin} />
                  <span>
                    <strong>{coin.name}</strong>
                    <small>{coin.symbol}</small>
                  </span>
                </Link>
                <div>
                  <span>Price</span>
                  <strong>{formatUsd(coin.price)}</strong>
                </div>
                <div>
                  <span>24h</span>
                  <strong className={coin.change24h >= 0 ? "is-up" : "is-down"}>
                    {formatPercent(coin.change24h)}
                  </strong>
                </div>
                <div>
                  <span>Market cap</span>
                  <strong>{formatCompactUsd(coin.marketCap)}</strong>
                </div>
                <div>
                  <span>Volume</span>
                  <strong>{formatCompactUsd(coin.volume)}</strong>
                </div>
                <Link href={`/coin/${coin.id}`} className="watch-open">
                  <LineChart size={16} />
                </Link>
                <span className="watch-remove" style={{ opacity: 0.3 }}>
                  <Star size={16} />
                </span>
              </article>
            ))}
          </section>
        )}
        <MarketFooter />
      </main>
    </div>
  );
}
