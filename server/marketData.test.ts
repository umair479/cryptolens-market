import { describe, expect, it } from "vitest";
import { compactSparkline, MARKET_REFRESH_MS, MARKET_REFRESH_SECONDS, normalizeBinancePairs, normalizeCoinbasePairs, normalizeCoins, selectMovers } from "./marketData";

describe("market data normalization", () => {
  it("uses a 20-second fresh cache window and exposes matching refresh metadata", () => {
    expect(MARKET_REFRESH_MS).toBe(20_000);
    expect(MARKET_REFRESH_SECONDS).toBe(20);
  });

  it("normalizes global coin records and selects the requested top movers", () => {
    const coins = normalizeCoins([
      { id: "one", symbol: "one", name: "One", image: "https://provider.example/one.png", current_price: 3, market_cap: 9_000_000, market_cap_rank: 2, total_volume: 2_000_000, price_change_percentage_24h: 4.5, sparkline_in_7d: { price: [1, 2, 3] } },
      { id: "two", symbol: "two", name: "Two", current_price: 2, market_cap: 12_000_000, market_cap_rank: 1, total_volume: 3_000_000, price_change_percentage_24h: -6.2, sparkline_in_7d: { price: [3, 2, 1] } },
    ]);

    expect(coins[0]).toMatchObject({ symbol: "ONE", price: 3, change24h: 4.5 });
    expect(coins[0]).not.toHaveProperty("image");
    expect(selectMovers(coins, "gainers").map((coin) => coin.symbol)).toEqual(["ONE"]);
    expect(selectMovers(coins, "decliners").map((coin) => coin.symbol)).toEqual(["TWO"]);
  });

  it("keeps only liquid Binance USDT pairs ordered by quote volume", () => {
    const pairs = normalizeBinancePairs([
      { symbol: "ETHUSDT", lastPrice: "3500", priceChangePercent: "1.2", quoteVolume: "900" },
      { symbol: "BTCUSDT", lastPrice: "67000", priceChangePercent: "2.4", quoteVolume: "1200" },
      { symbol: "ETHBTC", lastPrice: "0.05", priceChangePercent: "0.2", quoteVolume: "10000" },
    ]);

    expect(pairs.map((pair) => pair.symbol)).toEqual(["BTCUSDT", "ETHUSDT"]);
  });

  it("keeps active Coinbase USD and USDC spot products ordered by quote volume", () => {
    const pairs = normalizeCoinbasePairs([
      { product_id: "ETH-USD", price: "3500", price_percentage_change_24h: "1.2", approximate_quote_24h_volume: "900", product_type: "SPOT", status: "online", quote_currency_id: "USD" },
      { product_id: "BTC-USDC", price: "67000", price_percentage_change_24h: "2.4", approximate_quote_24h_volume: "1200", product_type: "SPOT", status: "online", quote_currency_id: "USDC" },
      { product_id: "ETH-BTC", price: "0.05", price_percentage_change_24h: "0.2", approximate_quote_24h_volume: "10000", product_type: "SPOT", status: "online", quote_currency_id: "BTC" },
    ]);

    expect(pairs.map((pair) => pair.symbol)).toEqual(["BTC-USDC", "ETH-USD"]);
  });

  it("downsamples dense seven-day series while keeping their endpoints", () => {
    const series = Array.from({ length: 168 }, (_, index) => index);
    const compact = compactSparkline(series, 32);

    expect(compact).toHaveLength(32);
    expect(compact[0]).toBe(0);
    expect(compact.at(-1)).toBe(167);
  });
});
