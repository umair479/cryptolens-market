import { Bookmark } from "lucide-react";
import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";

export default function Watchlist() {
  return <div className="light-app-shell"><MarketHeader active="watchlist" watchCount={0} /><main className="data-page"><section className="empty-watchlist"><Bookmark size={27} /><div className="page-overline">YOUR WATCHLIST</div><h1>Sign in to save live assets.</h1><p>Your market watchlist will persist across sessions after authentication is enabled.</p><button className="header-button">Sign in to continue</button></section><MarketFooter /></main></div>;
}
