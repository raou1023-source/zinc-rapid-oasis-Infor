export const CATEGORIES = ["world", "entertainment", "music", "politics", "sports", "economy"] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<
  Category,
  { label: string; kicker: string; tone: string }
> = {
  world: { label: "海外", kicker: "WORLD", tone: "tone-pol" },
  entertainment: { label: "芸能", kicker: "ENTERTAINMENT", tone: "tone-ent" },
  music: { label: "音楽", kicker: "MUSIC", tone: "tone-mus" },
  politics: { label: "政治", kicker: "POLITICS", tone: "tone-pol" },
  sports: { label: "スポーツ", kicker: "SPORTS", tone: "tone-spo" },
  economy: { label: "経済", kicker: "ECONOMY", tone: "tone-eco" },
};

export type NewsArticle = {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  publishedMs: number;
  category: Category;
  summary: string;
  originalTitle?: string;
  translated?: boolean;
  eventIds?: string[];
  sports?: string[];
  region?: "domestic" | "overseas";
  impact?: number;
  urgent?: boolean;
};

export type SpecialEvent = {
  id: string;
  kicker: string;
  category: Category;
  label: Record<"ja" | "en" | "zh" | "ko", string>;
  blurb: Record<"ja" | "en" | "zh" | "ko", string>;
  count: number;
};

export type NewsPayload = {
  fetchedAt: string;
  articles: NewsArticle[];
  events: SpecialEvent[];
};

export type DeskTab = "all" | "special" | Category;
