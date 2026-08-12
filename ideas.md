# CryptoLens Market — Design Direction

## Three directions considered

### Theme Name: Nocturne Ledger
Very dark, quietly cinematic market intelligence with restrained chartreuse signals and editorial data surfaces. It makes market complexity feel legible, composed, and premium.

**Probability:** 0.07

### Theme Name: Mineral Index
A light, tactile research journal with stone, parchment, and mineral-inspired accent colors. It positions crypto research as a calm, considered practice rather than a high-adrenaline trading screen.

**Probability:** 0.04

### Theme Name: Signal Bloom
A warmer, more expressive interface where market movements are visualized as organic pulses, paper-cut charts, and color-coded energy fields. It gives the product a more approachable, discovery-led personality.

**Probability:** 0.09

## Chosen approach: Nocturne Ledger

### Design Movement
Swiss International information design filtered through contemporary financial terminals and editorial art direction. The interface should feel like a trusted instrument: precise, calm, and visually memorable without copying CoinMarketCap or CoinGecko.

### Core Principles
1. **Signal over spectacle.** Every accent color and movement should explain market state, not decorate it.
2. **Dense, breathable hierarchy.** Use compact numeric clusters alongside generous negative space so the eye can scan without fatigue.
3. **Editorial trust.** Warm neutrals, restrained contrast, crisp type, and explicit context should make unfamiliar market data feel approachable.
4. **Original market language.** Use ownable motifs—lens mark, signal pips, and micro-sparkline choreography—instead of familiar category templates.

### Color Philosophy
The canvas is deep graphite rather than pure black so long sessions feel softer. Warm ivory is reserved for the most important data surfaces and type, creating a sense of paper and research notes inside a digital terminal. Electric chartreuse is the signature positive-signal color: rare, high-contrast, and instantly scannable. Burnt orange marks volatility, watch points, and negative movement without turning the product into a warning wall. Moss and steel-gray provide quieter context.

### Layout Paradigm
A left-anchored, asymmetric dashboard with a persistent narrow rail, a wide market stage, and a right-side signal column on large screens. The first viewport establishes a live market brief rather than a centered hero. Tables are wide and editorial; cards align to a baseline but vary in height and emphasis. On mobile the rail becomes a compact top bar and the right signal column becomes an ordered feed below the main ranking.

### Signature Elements
- **Lens mark and scanline:** the brand mark appears as a faceted lens; subtle one-pixel scanlines and grid ticks reinforce the research-instrument feeling.
- **Signal pips:** tiny chartreuse or orange status dots sit beside values and labels, conveying live state without extra copy.
- **Micro-sparklines:** small, custom line charts are used consistently in rankings, cards, and the watchlist to turn numeric lists into visual rhythms.

### Interaction Philosophy
Interactions should feel like inspecting a data instrument. Hover states reveal just enough context, focus states are obvious, and active filters change with a decisive but short transition. Search is immediate and forgiving. Watchlist actions feel like pinning a note, not like opening a modal. Placeholder actions are honest and surfaced as soon as the user requests unavailable features.

### Animation
Use 160–240ms ease-out transitions for filters, row emphasis, and button feedback. On first load, stagger market cards by 45ms and let sparklines draw from opacity 0.6 to 1 without scaling the layout. Positive and negative values can use a 1px signal-line shimmer on hover, but never pulse continuously. Respect reduced-motion preferences and never animate high-frequency quote updates in a distracting way.

### Typography System
Use **Sora** for display numbers, section titles, and brand-facing headlines; it has enough geometric character to feel ownable without becoming playful. Use **IBM Plex Mono** for tickers, timestamps, compact labels, and market statistics. Use **DM Sans** for body copy and navigation where warmth and legibility matter. Hierarchy: 12px uppercase mono metadata, 14px body/navigation, 16–18px row labels, 22–28px card figures, and 42–56px display numbers on the hero market brief.

### Brand Essence
**CryptoLens Market is a research-first market compass for curious crypto participants who want clear signals without the noise.**

Personality adjectives: **composed, incisive, quietly bold**.

### Brand Voice
Headlines should be concise and observant; CTAs should name the next action; microcopy should add context instead of hype. Avoid “to the moon,” urgency bait, and generic SaaS filler.

Example lines:
- “The market is repricing risk. Here’s where it’s happening.”
- “Track the assets worth a closer look.”

### Wordmark & Logo
The mark is a faceted lens aperture intersected by a rising candlestick: a visual shorthand for seeing market structure earlier. The wordmark uses a custom-spaced Sora treatment with a cut in the “O” of Lens echoing the aperture; the symbol remains legible as a standalone favicon and mobile rail icon.

### Signature Brand Color
**Lens Lime — `#C7F36B`**. It is bright enough to scan against graphite, less expected than default crypto green, and reserved for confirmed positive signal, active focus, and the brand mark.

## Style Decisions

- Prefer a dark editorial terminal over a generic exchange-like dashboard.
- Use chartreuse sparingly for meaning, not as a glow effect.
- Pair Sora, IBM Plex Mono, and DM Sans; do not use Inter.
- Keep layouts asymmetric and information-dense but breathable.
- Use generated ambient assets only in prominent signal surfaces; keep quantitative charts deterministic in code.


## Accepted review amendments

- The top-level chrome must establish the CryptoLens mark and wordmark before secondary breadcrumbs and status labels.
- The first viewport now leads with a live market snapshot, sync time, and market figures before the supporting headline.
- Main ranking rows now combine market cap and volume context with a consistent micro-sparkline rhythm.
- Instrument-native action language is preferred: “Scan the radar,” “Pin this brief,” and “Read the pulse.”

## Revision: Market Ledger Light

The user's latest requirement overrides the earlier Nocturne Ledger palette: CryptoLens Market now uses a bright, CoinMarketCap-inspired market surface while keeping its own mark, typography, signal language, and content hierarchy. The goal is familiar exchange-style scanability without copying another product's exact chrome.

The active design movement is **lightweight financial information design**: white data surfaces, soft gray page background, dark navy type, concise mono metadata, and a restrained blue action color. Positive 24-hour performance uses teal, negative performance uses coral, and coin identities retain their own muted brand colors. The layout prioritizes a compact market ticker, total market cap, summary metrics, top gainers, top decliners, market insight, and a wide ranking table.

The revised signature elements are the faceted CryptoLens mark in the header and footer, compact 7-day sparklines in every ranking view, and movement cards that make the 24-hour leaderboard immediately legible. Typography remains Sora for display values, IBM Plex Mono for tickers and metric labels, and DM Sans for navigation and explanations. The voice stays observant and research-led, while the surface becomes brighter and more familiar for everyday market scanning.
