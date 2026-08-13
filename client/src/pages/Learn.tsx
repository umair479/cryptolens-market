import { ArrowRight, BarChart3, BookOpen, CircleAlert, Layers3, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";

const guides = [
  { icon: BarChart3, index: "01", title: "How to read market cap", copy: "Market cap compares network value; it does not guarantee liquidity, utility, or future performance.", tag: "Foundations" },
  { icon: Layers3, index: "02", title: "Why exchange prices differ", copy: "Trading pairs, liquidity, and local order books can create small price differences across venues.", tag: "Market structure" },
  { icon: Scale, index: "03", title: "What 24-hour movers show", copy: "Gainer and decliner tables are screening tools, not investment recommendations or complete risk measures.", tag: "Research" },
  { icon: ShieldCheck, index: "04", title: "Protecting your crypto account", copy: "Use strong authentication, verify withdrawal addresses, and never share private keys or exchange API secrets.", tag: "Security" },
];

const fieldNotes = [
  { label: "Framework", title: "A practical checklist for reading a token page", copy: "Start with liquidity, supply, project documentation, and the specific use case before treating a percentage move as a thesis.", href: "/coin/bitcoin" },
  { label: "Market literacy", title: "Understanding supply, FDV, and circulating market cap", copy: "The relationship between reported supply and valuation is an important context layer, not a forecast.", href: "/" },
  { label: "Source awareness", title: "Why provider freshness matters", copy: "Different feeds use different methodologies, refresh intervals, and asset universes. CryptoLens labels those sources in context.", href: "/exchanges" },
];

export default function Learn() {
  return <div className="light-app-shell"><MarketHeader active="learn" /><main className="data-page">
    <section className="learn-hero"><div className="page-overline"><span className="status-dot-light" /> CRYPTOLENS LEARN</div><h1>Better market context<br /><em>starts here.</em></h1><p>Short, practical guides and research frames for understanding the live market screens without unnecessary hype.</p><div className="learn-hero-note"><CircleAlert size={15} /><span>Educational content only. Crypto assets can be volatile and carry substantial risk.</span></div></section>
    <section className="learn-grid">{guides.map(({ icon: Icon, index, title, copy, tag }) => <article className="learn-card" key={index}><div><span className="learn-index">{index}</span><Icon size={20} /></div><span className="card-overline">{tag}</span><h2>{title}</h2><p>{copy}</p><Link href="/" className="category-link">Explore data <ArrowRight size={14} /></Link></article>)}</section>
    <section className="field-notes"><div className="section-heading"><div><div className="page-overline">MARKET FIELD NOTES</div><h2>Research pathways, not headlines.</h2></div><Sparkles size={18} /></div><div className="field-notes-grid">{fieldNotes.map((note) => <article key={note.title}><span>{note.label}</span><h3>{note.title}</h3><p>{note.copy}</p><Link href={note.href}>Open context <ArrowRight size={13} /></Link></article>)}</div></section>
    <section className="learn-callout"><BookOpen size={24} /><div><span className="card-overline">KEEP EXPLORING</span><h2>See a number you do not recognize?</h2><p>Use the market tables as a starting point, then confirm asset and exchange details using official project and provider documentation.</p></div><Link href="/" className="header-button">View live rankings</Link></section>
    <MarketFooter />
  </main></div>;
}
