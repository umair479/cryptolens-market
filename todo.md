# CryptoLens Market Revision Checklist

- [x] Convert the dashboard from the dark Nocturne Ledger palette to a bright, CoinMarketCap-inspired light market surface while preserving CryptoLens branding.
- [x] Expand the illustrative crypto dataset with enough assets to make the rankings feel substantial.
- [x] Add dedicated 24-hour top gainers and top decliners sections with clear percentage movement, price, volume, and mini charts.
- [x] Update the main rankings table, filters, search, and watchlist behavior for the expanded asset universe.
- [x] Verify desktop and mobile layouts, TypeScript checks, and the production build before delivery.

## Live Platform Expansion

- [x] Keep exchange credentials server-side only and document the required secret setup without committing exposed keys.
- [x] Upgrade the static project with a secure backend proxy for live market-data requests.
- [x] Add live read-only market data with a clear fallback state when a provider is unavailable.
- [x] Make Categories, Exchanges, and Learn navigation routes functional with useful content.
- [x] Compute top 20 24-hour gainers and top 20 24-hour decliners from the selected live market universe.
- [x] Validate provider responses, error handling, mobile layouts, and production build before delivery.

### Selected architecture: Multi-provider aggregation

- [x] Use a broad market provider for normalized global coin rankings and market metadata.
- [x] Add exchange-specific read-only panels using Binance and additional supported exchange feeds where configured.
- [x] Normalize provider responses into one internal coin/exchange schema and show provider freshness/status.
- [x] Cache or throttle upstream requests so the frontend does not call providers directly or exceed public rate limits.
- [x] Add durable server-side secret handling documentation and clarify that exchange API secrets must not be committed or sent to the browser.
- [x] Add a second read-only exchange-specific feed from Coinbase public products alongside the Binance public ticker.
- [x] Show provider/source and freshness context across global market, category, and exchange routes.
