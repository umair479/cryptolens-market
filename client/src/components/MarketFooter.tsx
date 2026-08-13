import { Link } from "wouter";

const mark = "/manus-storage/cryptolens-mark_3a6b7471.png";

const columns = [
  { title: "Explore", links: [["Markets", "/"], ["Categories", "/categories"], ["Exchanges", "/exchanges"], ["Saved assets", "/watchlist"]] },
  { title: "Research", links: [["Learning hub", "/learn"], ["Market methodology", "/learn"], ["Data sources", "/exchanges"], ["Islamic-ethics screen", "/learn"]] },
  { title: "Product", links: [["Live rankings", "/"], ["Coin detail", "/coin/bitcoin"], ["Watchlist", "/watchlist"], ["Provider status", "/exchanges"]] },
] as const;

export function MarketFooter() {
  return <footer className="market-footer"><div className="market-footer-main"><div className="footer-intro"><Link href="/" className="footer-lockup"><img src={mark} alt="" /><strong>CryptoLens</strong></Link><p>Live market context, source-aware research, and personal asset tracking built for clear decision support.</p><span>Read-only market data • Not financial advice</span></div>{columns.map((column) => <div className="footer-column" key={column.title}><h3>{column.title}</h3>{column.links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>)}</div><div className="market-footer-bottom"><span>© 2026 CryptoLens Market</span><span>Market prices are provider-sourced and may be delayed.</span><span>Privacy • Terms • Cookie preferences</span></div></footer>;
}
