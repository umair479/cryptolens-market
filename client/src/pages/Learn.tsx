import { ArrowRight, BarChart3, BookOpen, CircleAlert, Layers3, Scale, ShieldCheck } from "lucide-react";
import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";

const guides = [
  { icon: BarChart3, index: "01", title: "How to read market cap", copy: "Market cap compares network value; it does not guarantee liquidity, utility, or future performance.", tag: "Foundations" },
  { icon: Layers3, index: "02", title: "Why exchange prices differ", copy: "Trading pairs, liquidity, and local order books can create small price differences across venues.", tag: "Market structure" },
  { icon: Scale, index: "03", title: "What 24-hour movers show", copy: "Gainer and decliner tables are screening tools, not investment recommendations or complete risk measures.", tag: "Research" },
  { icon: ShieldCheck, index: "04", title: "Protecting your crypto account", copy: "Use strong authentication, verify withdrawal addresses, and never share private keys or exchange API secrets.", tag: "Security" },
];

export default function Learn() {
  return <div className="light-app-shell"><MarketHeader active="learn" /><main className="data-page">
    <section className="learn-hero"><div className="page-overline"><span className="status-dot-light" /> CRYPTOLENS LEARN</div><h1>Better market context<br /><em>starts here.</em></h1><p>Short, practical guides to help you understand the screens you are using without unnecessary hype.</p><div className="learn-hero-note"><CircleAlert size={15} /><span>Educational content only. Crypto assets can be volatile and carry substantial risk.</span></div></section>
    <section className="learn-grid">{guides.map(({ icon: Icon, index, title, copy, tag }) => <article className="learn-card" key={index}><div><span className="learn-index">{index}</span><Icon size={20} /></div><span className="card-overline">{tag}</span><h2>{title}</h2><p>{copy}</p><button className="category-link">Read guide <ArrowRight size={14} /></button></article>)}</section>
    <section className="learn-callout"><BookOpen size={24} /><div><span className="card-overline">KEEP EXPLORING</span><h2>See a number you do not recognize?</h2><p>Use the market tables as a starting point, then confirm asset and exchange details using official project and provider documentation.</p></div></section>
    <MarketFooter />
  </main></div>;
}
