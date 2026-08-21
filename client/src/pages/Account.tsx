import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";
import { TrendingUp, BarChart3, Globe, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function Account() {
  return (
    <div className="light-app-shell">
      <MarketHeader active="account" />
      <main className="data-page account-page">
        <section className="account-hero">
          <div className="account-avatar-large">
            <Globe size={32} />
          </div>
          <div>
            <div className="page-overline">
              <span className="status-dot-light" /> PUBLIC MARKET ACCESS
            </div>
            <h1>Welcome to CryptoLens Market</h1>
            <p>Free and open cryptocurrency market data for everyone</p>
          </div>
        </section>
        
        <section className="account-grid">
          <article className="account-card">
            <div className="account-card-head">
              <div>
                <span className="card-overline">LIVE DATA</span>
                <h2>Real-time prices</h2>
              </div>
              <TrendingUp size={20} />
            </div>
            <p>
              Access live cryptocurrency prices, market caps, and trading volumes 
              from trusted sources like CoinGecko and Binance.
            </p>
            <Link href="/" className="account-link">
              View live markets <ChevronRight size={14} />
            </Link>
          </article>
          
          <article className="account-card">
            <div className="account-card-head">
              <div>
                <span className="card-overline">MARKET ANALYSIS</span>
                <h2>Professional insights</h2>
              </div>
              <BarChart3 size={20} />
            </div>
            <p>
              Explore detailed coin information, price charts, and market analysis
              without any registration or account requirements.
            </p>
            <Link href="/coin/bitcoin" className="account-link">
              Explore Bitcoin <ChevronRight size={14} />
            </Link>
          </article>
          
          <article className="account-card">
            <div className="account-card-head">
              <div>
                <span className="card-overline">EXCHANGE DATA</span>
                <h2>Trading platforms</h2>
              </div>
              <Globe size={20} />
            </div>
            <p>
              Compare cryptocurrency exchanges, trading volumes, and market data
              across multiple platforms instantly.
            </p>
            <Link href="/exchanges" className="account-link">
              View exchanges <ChevronRight size={14} />
            </Link>
          </article>
        </section>
        
        <MarketFooter />
      </main>
    </div>
  );
}
