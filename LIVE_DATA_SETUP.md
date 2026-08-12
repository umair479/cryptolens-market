# Live Data Setup

CryptoLens Market reads market information through server-side provider modules. Browser code never receives provider credentials and must never call private exchange endpoints directly.

## Required server secret

Add `COINGECKO_DEMO_API_KEY` through the project secret settings. This key supports the CoinGecko Demo API calls used for the global top-250 market universe, categories, and exchange metadata. The server reads it only through `server/_core/env.ts`; it must not be added to committed files, client-side variables, screenshots, or chat messages.

## Read-only exchange feeds

The Binance and Coinbase spot panels use public market-data endpoints. They do not use Binance Testnet keys, Coinbase account keys, wallet addresses, account balances, order placement, or any trading permission. A provider failure is contained to its panel while the global market provider remains available when possible.

## Refresh and caching

The server caches upstream responses for approximately 55 seconds. This protects provider quotas, avoids exposing upstream traffic to browsers, and gives all frontend clients a shared normalized market response. The user interface shows provider/source status and refresh timing rather than claiming tick-level real-time execution.

## Security checklist

Rotate any credential that was posted in chat or source control. Use least-privilege, read-only credentials where credentials are ever needed. Never include a private key, exchange API secret, or account-level API key in frontend code.

## Current persistence choice

The current release uses the project’s existing database for curated coin research and educational screening records. Supabase was intentionally left inactive to avoid maintaining two databases. A future migration can move this table to Supabase after a deliberate provider change.
