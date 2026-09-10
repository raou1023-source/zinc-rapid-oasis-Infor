import type { NewsArticle } from "./types";

export function byFreshness(articles: NewsArticle[]): NewsArticle[] {
  return [...articles].sort((a, b) => b.publishedMs - a.publishedMs);
}

export function latestUpdates(articles: NewsArticle[], limit = 12): NewsArticle[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const fresh = byFreshness(articles).filter((a) => now - a.publishedMs < day && a.publishedMs <= now + 5 * 60 * 1000);
  if (fresh.length >= 6) return fresh.slice(0, limit);
  return byFreshness(articles).slice(0, limit);
}
