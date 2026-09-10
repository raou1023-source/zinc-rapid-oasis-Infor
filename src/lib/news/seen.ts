import type { NewsArticle } from "./types";

const KEY = "inho-seen-articles";

function readAll(): NewsArticle[] {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as NewsArticle[];
    return Array.isArray(parsed) ? parsed.filter((a) => a && typeof a.id === "string") : [];
  } catch {
    return [];
  }
}

export function rememberArticles(list: NewsArticle[]) {
  if (typeof sessionStorage === "undefined" || list.length === 0) return;
  try {
    const map = new Map(readAll().map((a) => [a.id, a] as const));
    for (const article of list) map.set(article.id, article);
    sessionStorage.setItem(KEY, JSON.stringify([...map.values()].slice(-240)));
  } catch {
    /* quota */
  }
}

export function recallArticle(id: string): NewsArticle | null {
  return readAll().find((a) => a.id === id) ?? null;
}
