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

## Coin Detail and Screening Expansion

- [x] Decide to use the existing project database for this release and leave the inactive Supabase project untouched.
- [x] Document the optional future Supabase migration without adding a second database to this release.
- [x] Add existing-database support for persistent coin research metadata and screening states, with unknown as the safe default until curated research is available.
- [x] Make every live market ranking row open a dedicated React coin detail page.
- [x] Show live price, market cap, volume, rank, 24-hour movement, chart context, and exchange/source links on coin pages.
- [x] Add an educational Islamic-ethics screening framework with transparent criteria, evidence state, and a non-binding disclosure.
- [x] Keep the implementation in React and JavaScript/TypeScript, with no additional runtime language required.
- [x] Test data persistence, coin routing, live-data fallbacks, and responsive detail pages before delivery.
- [x] Link the reusable market-row coin identity to the React detail route across rankings, movers, and watchlist cards.
- [x] Persist and retrieve one non-binding Bitcoin research record through the existing database to verify the data path.
- [x] Verify the unknown-asset recovery state shows a clear Back to markets action and a Retry control.

## Comprehensive Market Platform Expansion

- [x] Preserve original CryptoLens branding while adopting the reference screenshots’ dense market-information hierarchy.
- [x] Expand coin detail pages with broader performance periods, market-cap/volume context, supply progress, price range, and trading links.
- [x] Add a clear Manus OAuth sign-in, signed-in account state, and persistent authenticated watchlist storage.
- [x] Add real market-category filtering and explicit pagination controls to the live home rankings.
- [x] Add an original research-desk module to the public market experience without reproducing third-party editorial content.
- [x] Expand footer navigation, disclosure, and product-resource information for a client-ready public platform.
- [x] Verify protected API behavior, signed-out OAuth controls, live market flows, desktop/mobile layouts, tests, and the production build.
- [x] Optional owner browser sign-in verification for the live OAuth account menu and persisted watchlist is deferred by user choice.
- [x] Add provider-backed category filtering to the home rankings and validate it together with pagination on desktop and mobile.
- [x] Verify selected provider-backed category controls and pagination on final desktop and mobile layouts.

## High-Density Market Intelligence Refinement

- [x] Add provider-backed 1-hour, 24-hour, and 7-day comparison fields to live market rows and coin detail data.
- [x] Add compact original market intelligence cards for market cap, benchmark movement, activity, and market context.
- [x] Rework the rankings toolbar with network-style filters, table-column controls, and clearer market sorting affordances.
- [x] Complete the visible account journey with a dedicated account page, explicit signed-in state, saved-asset status, and safe sign-out controls.
- [x] Verify live multi-period comparisons, signed-out/authenticated UI states, desktop/mobile density, tests, and production build.
- [x] Add real rankings table-column controls and multi-field sorting controls, then validate the dense table on desktop and mobile.
- [x] Verify successful OAuth sign-in, the signed-in account page, saved-asset status, and sign-out procedure coverage.
- [x] Reconfirm the fresh signed-out account gate and authenticated project-preview account page, with saved-asset status and tested logout procedure, after the final dense-market refinement.
- [x] Finalize delivery with manual browser OAuth login verification deferred by user choice; retain signed-out browser and automated logout coverage.

## Bold Editorial Research Expansion

- [x] Strengthen the visual system with a clear, responsive bold display hierarchy for primary market and research content.
- [x] Expand the Learn hub with detailed original research topic cards and structured educational explanations.
- [x] Add linked research detail routes with readable summaries, key concepts, risk context, and links back to live market views.
- [x] Verify bold text contrast, research navigation, desktop/mobile layout, tests, and production build before delivery.

## Account Onboarding and Performance Remediation

- [x] Audit the existing Manus OAuth capabilities and present a visible Create account path without making unsupported email-verification claims.
- [x] Add account onboarding and verification-status messaging that explains the identity provider’s confirmation responsibility.
- [x] Profile the slow market snapshot and coin-detail calls, including cold and warm response times.
- [x] Improve server-side provider caching, concurrent request handling, and client stale-data presentation to reduce wait time.
- [x] Validate sign-up/sign-in states, account messaging, API response timing, tests, and desktop/mobile behavior before delivery.
- [x] Preserve a recently refreshed market snapshot during the active server process through startup prewarming and stale-while-revalidate caching.
- [x] Add explicit live-data freshness messaging so users understand when a cached market snapshot is being refreshed.
- [x] Reverify the project-preview signed-in account interface and saved-asset status after the new onboarding copy changes; manual browser OAuth click-through remains deferred by owner choice.

## Search, Expanded Market Coverage, and Navigation Repair

- [x] Diagnose and fix the header search so a query reliably filters or opens matching live coins.
- [x] Expand the live market universe to approximately 600 assets using cached, rate-limit-aware paged provider data.
- [x] Keep ranking pagination, search results, mover boards, and coin detail navigation working with the expanded universe.
- [x] Repair every footer link so it resolves to a specific internal market, research, account, screening, or provider destination.
- [x] Validate desktop/mobile search, at least 500 loaded assets, pagination, individual link destinations, tests, and production build.
- [x] Exercise live header search results and verify selecting a coin opens the matching detail route.
- [x] Verify repaired footer links and anchors resolve to their intended live-ranking, research, screening, and provider destinations.
- [x] Verify the expanded search, pagination, and footer navigation are usable on a mobile viewport.
- [x] Make the global header search visibly usable at the phone breakpoint and verify selecting a result there.
- [x] Exercise mobile ranking pagination controls and confirm the selected ranking page changes without horizontal overflow.

## Bold Market Typography Refresh

- [x] Strengthen display headings, section titles, table identities, controls, and primary figures with a clear bold market-tracker hierarchy.
- [x] Preserve readable supporting text, responsive density, original CryptoLens branding, and accessible contrast.
- [x] Verify desktop and mobile typography visually, then run type checks, tests, and a production build.
