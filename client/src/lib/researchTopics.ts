export type ResearchTopic = {
  slug: string;
  category: string;
  index: string;
  title: string;
  dek: string;
  summary: string;
  liveHref: string;
  sections: Array<{ heading: string; body: string }>;
  checklist: string[];
  caution: string;
  sources: Array<{ label: string; href: string }>;
};

export const researchTopics: ResearchTopic[] = [
  {
    slug: "market-cap-in-context",
    category: "Foundations",
    index: "01",
    title: "Market cap is a starting point, not a conclusion.",
    dek: "Use market capitalization to compare scale, then add liquidity, supply, and source context before treating it as a thesis.",
    summary: "Market cap is commonly presented as current price multiplied by circulating supply. It is a useful size measure, but it does not directly describe depth of liquidity, project quality, or how easily an asset can be bought or sold at the quoted price.",
    liveHref: "/",
    sections: [
      { heading: "Read the definition first", body: "A market-cap figure depends on both the reported price and the circulating-supply estimate. CryptoLens surfaces source labels because providers can use different aggregation and verification methods." },
      { heading: "Put the number beside trading context", body: "Compare market cap with reported volume, the number of venues, and the price range. A large headline value does not on its own establish that an order can be executed with minimal price impact." },
      { heading: "Use it for comparisons, not forecasts", body: "Market cap can help organize assets by relative scale. It cannot predict future returns, establish utility, or replace reading project documentation and risk disclosures." },
    ],
    checklist: ["Check the source and refresh time for price and supply.", "Compare market capitalization with reported volume and venue coverage.", "Open the coin page and review supply, FDV, and official links together."],
    caution: "Do not infer liquidity or investment suitability from market cap alone.",
    sources: [{ label: "CoinGecko methodology: market capitalization and supply", href: "https://www.coingecko.com/en/methodology" }],
  },
  {
    slug: "supply-fdv-and-unlocks",
    category: "Token design",
    index: "02",
    title: "Supply, FDV, and unlocks change the valuation conversation.",
    dek: "Separate circulating supply from total and maximum supply before comparing a token’s reported valuation.",
    summary: "Circulating supply, total supply, maximum supply, and fully diluted valuation describe different things. They are best read as a supply framework rather than as standalone quality scores.",
    liveHref: "/coin/ethereum",
    sections: [
      { heading: "Circulating supply is a point-in-time estimate", body: "Providers may obtain supply data from teams, public ledgers, or explorers. The reliability and methodology should be considered whenever the figure drives a valuation comparison." },
      { heading: "FDV asks a different question", body: "Fully diluted valuation combines a current price with a broader supply assumption. It can be useful for scenario comparison, but it does not describe when supply becomes available or whether it will trade." },
      { heading: "Look for the mechanism", body: "Token issuance, burns, staking rewards, vesting, and unlock schedules can affect supply over time. Read the protocol documentation and verify the mechanism rather than relying only on a dashboard value." },
    ],
    checklist: ["Record circulating, total, and maximum supply separately.", "Identify the source for any reported supply number.", "Read official documentation for issuance, vesting, and burn mechanisms."],
    caution: "Supply metrics are contextual measures, not price targets or predictions.",
    sources: [{ label: "Ethereum.org: ETH supply and issuance", href: "https://ethereum.org/eth/supply/" }, { label: "CoinGecko methodology: circulating supply", href: "https://www.coingecko.com/en/methodology" }],
  },
  {
    slug: "liquidity-and-price-discovery",
    category: "Market structure",
    index: "03",
    title: "Liquidity explains why quoted prices can differ.",
    dek: "A ticker is a record of recent trades; market depth and venue quality determine how useful that number is for a real transaction.",
    summary: "Price discovery occurs across trading pairs and venues. Reported volume can be informative, but order-book depth, spreads, trade activity, and data freshness offer additional context for judging a market signal.",
    liveHref: "/exchanges",
    sections: [
      { heading: "Start with the venue", body: "Exchange feeds can differ because pairs, local order books, and available counterparties differ. CryptoLens keeps exchange-specific panels distinct from the global aggregate for that reason." },
      { heading: "Volume is only one signal", body: "A reported volume figure describes activity over a period. It does not by itself show order-book depth, the spread at the time of a trade, or whether data is timely and representative." },
      { heading: "Check freshness and anomalies", body: "A robust research workflow notices source labels, refresh times, price ranges, and meaningful differences across venues before acting on a price movement." },
    ],
    checklist: ["Compare the global aggregate with exchange-specific panels.", "Check reported volume beside range and source freshness.", "Treat unusual spreads or sudden price gaps as a prompt for further verification."],
    caution: "High reported volume is not a guarantee of executable liquidity or reliable price discovery.",
    sources: [{ label: "CoinGecko methodology: price aggregation and exchange data", href: "https://www.coingecko.com/en/methodology" }],
  },
  {
    slug: "reading-1h-24h-and-7d",
    category: "Market literacy",
    index: "04",
    title: "Read 1h, 24h, and 7d together—not in isolation.",
    dek: "Short-period changes are different lenses on the same market; they are not a signal to buy or sell.",
    summary: "One-hour, one-day, and seven-day changes can describe different parts of a price path. Placing them side by side helps separate a recent move from a broader period context.",
    liveHref: "/",
    sections: [
      { heading: "One hour is the narrowest lens", body: "A one-hour change can be sensitive to a small set of trades, an exchange event, or a temporary liquidity shift. It is best treated as a prompt to inspect the source and the broader trend." },
      { heading: "Twenty-four hours standardizes a daily snapshot", body: "A 24-hour comparison is widely used in market tables. It remains a backward-looking measure and should be read with volume, range, and market-cap context." },
      { heading: "Seven days adds a wider frame", body: "Seven-day movement can reveal whether a daily move is occurring inside a longer period of strength, weakness, or volatility. It still does not predict what happens next." },
    ],
    checklist: ["Scan all three intervals before interpreting a movement.", "Compare the move with volume and the seven-day sparkline.", "Use coin and exchange pages to identify data-source context."],
    caution: "Past percentage moves are descriptive, not an investment recommendation.",
    sources: [{ label: "CryptoLens market methodology and source labels", href: "/exchanges" }],
  },
  {
    slug: "token-standards-and-contract-risk",
    category: "Protocol basics",
    index: "05",
    title: "Token standards define behavior; they do not certify safety.",
    dek: "Recognize the difference between a standard interface, a project’s implementation, and the risks of interacting with a token contract.",
    summary: "Standards such as ERC-20 aim to make token behavior interoperable across wallets and applications. A standard does not eliminate implementation, governance, custody, or smart-contract risk.",
    liveHref: "/coin/ethereum",
    sections: [
      { heading: "Understand the interface", body: "Token standards define commonly expected functions and behavior. This can help applications integrate assets consistently, but the standard is not a review of an individual project." },
      { heading: "Verify the exact contract", body: "A ticker name is not sufficient identification. When interacting on-chain, verify the official contract address through project documentation and reputable explorers." },
      { heading: "Treat permissions as risk context", body: "Administrative keys, upgradeability, approvals, and contract interactions can all matter. Read the project’s technical documentation and security disclosures before connecting a wallet." },
    ],
    checklist: ["Find the official project documentation before using a contract.", "Verify the contract address on a reputable explorer.", "Review permissions, upgradeability, and security disclosures."],
    caution: "Token standards improve compatibility; they are not an endorsement, audit, or safety guarantee.",
    sources: [{ label: "Ethereum.org: token standards", href: "https://ethereum.org/developers/docs/standards/tokens/" }],
  },
  {
    slug: "account-and-wallet-hygiene",
    category: "Security",
    index: "06",
    title: "Account hygiene is part of market research.",
    dek: "Separate tracking from custody, use strong account security, and treat private keys and API secrets as highly sensitive.",
    summary: "A market dashboard can help organize information, but it should not be a place to store private keys or trading secrets. Keep access controls and wallet approvals under deliberate review.",
    liveHref: "/account",
    sections: [
      { heading: "Use the account layer for tracking", body: "CryptoLens saves watchlist preferences behind an authenticated account. It does not ask for wallet seed phrases, private keys, or exchange API secrets." },
      { heading: "Confirm before connecting", body: "Before approving a wallet request or linking a service, verify the domain, read the requested permissions, and understand what can be moved or changed." },
      { heading: "Keep a recovery plan", body: "Use unique credentials, multi-factor authentication where available, and a secure recovery process appropriate to the account and custody method." },
    ],
    checklist: ["Never share a seed phrase, private key, or API secret.", "Use a unique password and multi-factor authentication.", "Review active sessions and approvals on a regular schedule."],
    caution: "No platform can reverse a transaction made after private credentials are compromised.",
    sources: [{ label: "Ethereum.org: security and scam prevention", href: "https://ethereum.org/security/" }],
  },
];

export function getResearchTopic(slug: string) {
  return researchTopics.find((topic) => topic.slug === slug);
}
