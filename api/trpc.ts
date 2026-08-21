import "dotenv/config";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { appRouter } from "../server/routers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-trpc-source");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Build a full URL from Vercel's request
  const host = req.headers.host ?? "localhost";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const url = `${protocol}://${host}${req.url}`;

  // Build a proper Request object for the fetch adapter
  const headers = new Headers();
  for (const [key, val] of Object.entries(req.headers)) {
    if (val) headers.set(key, Array.isArray(val) ? val.join(", ") : val);
  }

  let body: BodyInit | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = JSON.stringify(req.body);
    headers.set("content-type", "application/json");
  }

  const fetchReq = new Request(url, {
    method: req.method ?? "GET",
    headers,
    body,
  });

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: fetchReq,
    router: appRouter,
    createContext: () => ({ user: null, req: req as any, res: res as any }),
  });

  // Copy response to Vercel response
  res.status(response.status);
  response.headers.forEach((val, key) => {
    res.setHeader(key, val);
  });
  const text = await response.text();
  res.send(text);
}
