import { ENV } from "./_core/env";
import { getEducationalScreening } from "./coinResearch";

type CoinGeckoDetailResponse = {
  id: string;
  symbol: string;
  name: string;
  image?: { large?: string; small?: string };
  description?: { en?: string };
  categories?: string[];
  links?: { homepage?: string[]; blockchain_site?: string[] };
  market_cap_rank?: number | null;
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    price_change_percentage_24h?: number | null;
    price_change_percentage_7d?: number | null;
    market_cap_change_percentage_24h?: number | null;
    circulating_supply?: number | null;
    total_supply?: number | null;
    max_supply?: number | null;
    ath?: { usd?: number };
    ath_change_percentage?: { usd?: number };
    atl?: { usd?: number };
    sparkline_7d?: { price?: number[] };
  };
  last_updated?: string;
};

const detailCache = new Map<string, { expiresAt: number; value: CoinGeckoDetailResponse }>();
const CACHE_MS = 55_000;

function finite(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function plainText(value?: string) {
  return (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function getLiveCoinDetail(coinId: string) {
  const cached = detailCache.get(coinId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  if (!ENV.coingeckoDemoApiKey) throw new Error("CoinGecko provider is not configured");

  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coinId)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`, {
    headers: { accept: "application/json", "x-cg-demo-api-key": ENV.coingeckoDemoApiKey },
  });
  if (!response.ok) throw new Error(`Coin detail is temporarily unavailable (${response.status})`);
  const value = (await response.json()) as CoinGeckoDetailResponse;
  detailCache.set(coinId, { value, expiresAt: Date.now() + CACHE_MS });
  return value;
}

export async function getCoinDetail(coinId: string) {
  const live = await getLiveCoinDetail(coinId);
  const data = live.market_data;
  const screening = await getEducationalScreening(live.id, live.name);
  const homepage = live.links?.homepage?.find(Boolean) ?? null;
  const blockchain = live.links?.blockchain_site?.find(Boolean) ?? null;

  return {
    coin: {
      id: live.id,
      symbol: live.symbol.toUpperCase(),
      name: live.name,
      image: live.image?.large ?? live.image?.small ?? null,
      description: plainText(live.description?.en).slice(0, 900),
      categories: (live.categories ?? []).slice(0, 5),
      homepage,
      blockchain,
      rank: live.market_cap_rank ?? null,
      price: finite(data?.current_price?.usd),
      marketCap: finite(data?.market_cap?.usd),
      volume: finite(data?.total_volume?.usd),
      change24h: finite(data?.price_change_percentage_24h),
      change7d: finite(data?.price_change_percentage_7d),
      marketCapChange24h: finite(data?.market_cap_change_percentage_24h),
      circulatingSupply: data?.circulating_supply ?? null,
      totalSupply: data?.total_supply ?? null,
      maxSupply: data?.max_supply ?? null,
      ath: finite(data?.ath?.usd),
      athChange: finite(data?.ath_change_percentage?.usd),
      atl: finite(data?.atl?.usd),
      sparkline: (data?.sparkline_7d?.price ?? []).filter((value) => Number.isFinite(value)),
      lastUpdated: live.last_updated ?? null,
    },
    screening,
    source: { name: "CoinGecko Demo API", refreshedAt: new Date().toISOString(), refreshSeconds: 60 },
  };
}
