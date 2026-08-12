import { describe, expect, it } from "vitest";

describe("CoinGecko demo credential", () => {
  it("authorizes a lightweight read-only market-price request", async () => {
    const apiKey = process.env.COINGECKO_DEMO_API_KEY;
    expect(apiKey).toBeTruthy();

    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      {
        headers: {
          "x-cg-demo-api-key": apiKey as string,
          accept: "application/json",
        },
      },
    );

    expect(response.ok).toBe(true);
    const payload = (await response.json()) as { bitcoin?: { usd?: number } };
    expect(typeof payload.bitcoin?.usd).toBe("number");
  }, 20_000);
});
