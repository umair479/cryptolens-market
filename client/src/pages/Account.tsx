import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { MarketFooter } from "@/components/MarketFooter";
import { MarketHeader } from "@/components/MarketHeader";
import { trpc } from "@/lib/trpc";
import { Bookmark, ChevronRight, CircleUserRound, LogOut, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Account() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const saved = trpc.watchlist.list.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30_000, retry: false });

  if (loading) return <div className="light-app-shell"><MarketHeader active="account" /><main className="data-page"><section className="account-loading">Checking your secure account session…</section><MarketFooter /></main></div>;
  if (!isAuthenticated) return <div className="light-app-shell"><MarketHeader active="account" /><main className="data-page"><section className="empty-watchlist account-gate"><CircleUserRound size={29} /><div className="page-overline">CRYPTOLENS ACCOUNT</div><h1>Sign in to use your market workspace.</h1><p>A secure Manus session lets you save assets, retain your watchlist, and access your account controls without exposing market-provider credentials.</p><button className="header-button" onClick={startLogin}>Sign in with Manus</button><Link href="/" className="text-link">Return to live markets <ChevronRight size={14} /></Link></section><MarketFooter /></main></div>;

  return <div className="light-app-shell"><MarketHeader active="account" /><main className="data-page account-page"><section className="account-hero"><div className="account-avatar-large">{user?.name?.slice(0, 1).toUpperCase() || "A"}</div><div><div className="page-overline"><span className="status-dot-light" /> AUTHENTICATED MARKET WORKSPACE</div><h1>{user?.name || "Your account"}</h1><p>{user?.email || "Signed in with Manus"}</p></div><button className="outline-button" onClick={() => void logout()}><LogOut size={14} /> Sign out</button></section><section className="account-grid"><article className="account-card"><div className="account-card-head"><div><span className="card-overline">SAVED ASSETS</span><h2>{saved.data?.length ?? 0} assets</h2></div><Bookmark size={20} /></div><p>Saved coins remain tied to this account and can be managed from your private watchlist.</p><Link href="/watchlist" className="account-link">Open saved assets <ChevronRight size={14} /></Link></article><article className="account-card"><div className="account-card-head"><div><span className="card-overline">SESSION SECURITY</span><h2>Protected</h2></div><ShieldCheck size={20} /></div><p>Your session uses the platform’s account flow. Provider secrets remain isolated on the server.</p><span className="account-note">Login method: {user?.loginMethod || "Manus"}</span></article><article className="account-card"><div className="account-card-head"><div><span className="card-overline">NEXT ACTION</span><h2>Build your watchlist</h2></div><CircleUserRound size={20} /></div><p>Open a coin detail page, then use Save to add it to this signed-in account.</p><Link href="/coin/bitcoin" className="account-link">Open Bitcoin detail <ChevronRight size={14} /></Link></article></section><MarketFooter /></main></div>;
}
