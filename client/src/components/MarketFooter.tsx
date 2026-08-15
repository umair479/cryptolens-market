import { Link } from "wouter";

import { BrandMark } from "@/components/BrandMark";

const columns = [
  { title: "Explore", links: [["Markets", "/"], ["Categories", "/categories"], ["Exchanges", "/exchanges"], ["Saved assets", "/watchlist"]] },
  { title: "Research", links: [["Learning hub", "/learn"], ["Market methodology", "/research/market-cap-in-context"], ["Data sources", "/research/liquidity-and-price-discovery"], ["Islamic-ethics screen", "/coin/bitcoin#islamic-ethics-screen"]] },
  { title: "Product", links: [["Live rankings", "/#live-rankings"], ["Coin detail", "/coin/bitcoin"], ["Watchlist", "/watchlist"], ["Provider status", "/exchanges#provider-status"]] },
] as const;

export function MarketFooter() {
  return <footer className="market-footer"><div className="market-footer-main"><div className="footer-intro"><Link href="/" className="footer-lockup"><BrandMark className="footer-brand-mark" /><strong>CryptoLens</strong></Link><p>Live market context, source-aware research, and personal asset tracking built for clear decision support.</p><span>Read-only market data • Not financial advice</span></div>{columns.map((column) => <div className="footer-column" key={column.title}><h3>{column.title}</h3>{column.links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>)}</div><div className="market-footer-bottom"><span>© 2026 CryptoLens Market</span><span>Market prices are provider-sourced and may be delayed.</span><span>Privacy • Terms • Cookie preferences</span></div></footer>;
}
