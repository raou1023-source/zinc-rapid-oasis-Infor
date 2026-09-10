import { createServerFn } from "@tanstack/react-start";
import { LOCALES, parseLocale, type Locale } from "@/lib/i18n/locales";
import { activeEvents, DISASTER_EVENT_ID, scheduledEvents, tagArticles, type EventDef } from "./events";
import { sportById, tagSports } from "./sports";
import { cleanSummary, isArticleId, safeHttpUrl, safeText, stripTags } from "./safe";
import { applyCachedTranslations, localizeWorldArticles } from "./translate";
import { tagImpact } from "./impact";
import { CATEGORY_META, CATEGORIES, type Category, type NewsArticle, type NewsPayload } from "./types";

type Feed = { category: Category; url: string; sourceHint: string; eventId?: string; region?: "domestic" | "overseas" };

const GOOGLE_LOCALE: Record<Locale, { hl: string; gl: string; ceid: string; source: string }> = {
  ja: { hl: "ja", gl: "JP", ceid: "JP:ja", source: "Google ニュース" },
  en: { hl: "en-US", gl: "US", ceid: "US:en", source: "Google News" },
  zh: { hl: "zh-CN", gl: "US", ceid: "US:zh-Hans", source: "谷歌新闻" },
  ko: { hl: "ko", gl: "KR", ceid: "KR:ko", source: "Google 뉴스" },
};

const TOPICS: { category: Category; topic: string }[] = [
  { category: "world", topic: "WORLD" },
  { category: "entertainment", topic: "ENTERTAINMENT" },
  { category: "politics", topic: "NATION" },
  { category: "sports", topic: "SPORTS" },
  { category: "economy", topic: "BUSINESS" },
];

const YAHOO_JA: Feed[] = [
  {
    category: "world",
    url: "https://news.yahoo.co.jp/rss/topics/world.xml",
    sourceHint: "Yahoo!ニュース",
  },
  {
    category: "entertainment",
    url: "https://news.yahoo.co.jp/rss/topics/entertainment.xml",
    sourceHint: "Yahoo!ニュース",
  },
  {
    category: "sports",
    url: "https://news.yahoo.co.jp/rss/topics/sports.xml",
    sourceHint: "Yahoo!ニュース",
  },
  {
    category: "economy",
    url: "https://news.yahoo.co.jp/rss/topics/business.xml",
    sourceHint: "Yahoo!ニュース",
  },
];

const NHK_JA: Feed[] = [
  {
    category: "politics",
    region: "domestic",
    url: "https://www3.nhk.or.jp/rss/news/cat4.xml",
    sourceHint: "NHK",
  },
  {
    category: "economy",
    url: "https://www3.nhk.or.jp/rss/news/cat5.xml",
    sourceHint: "NHK",
  },
  {
    category: "sports",
    url: "https://www3.nhk.or.jp/rss/news/cat7.xml",
    sourceHint: "NHK",
  },
  {
    category: "entertainment",
    url: "https://www3.nhk.or.jp/rss/news/cat3.xml",
    sourceHint: "NHK",
  },
];

const MUSIC_QUERY: Record<Locale, { domestic: string; overseas: string }> = {
  ja: {
    domestic: "邦楽 OR J-POP OR オリコン OR 日本 音楽 OR 新曲",
    overseas: "洋楽 OR Billboard OR K-pop OR 海外 音楽",
  },
  en: {
    domestic: "J-pop OR Japanese music OR Oricon",
    overseas: "Billboard OR K-pop OR album OR concert -Japan",
  },
  zh: {
    domestic: "日本 音乐 OR J-POP OR 邦乐",
    overseas: "欧美 音乐 OR Billboard OR K-pop",
  },
  ko: {
    domestic: "J-POP OR 일본 음악 OR 오리콘",
    overseas: "빌보드 OR K-pop OR 해외 음악",
  },
};

function musicFeeds(lang: Locale): Feed[] {
  const loc = GOOGLE_LOCALE[lang];
  const q = MUSIC_QUERY[lang];
  return [
    {
      category: "music",
      region: "domestic",
      sourceHint: loc.source,
      url: `https://news.google.com/rss/search?q=${encodeURIComponent(q.domestic)}&hl=${loc.hl}&gl=${loc.gl}&ceid=${encodeURIComponent(loc.ceid)}`,
    },
    {
      category: "music",
      region: "overseas",
      sourceHint: loc.source,
      url: `https://news.google.com/rss/search?q=${encodeURIComponent(q.overseas)}&hl=${loc.hl}&gl=${loc.gl}&ceid=${encodeURIComponent(loc.ceid)}`,
    },
    {
      category: "music",
      region: "overseas",
      url: "https://www.billboard.com/feed/",
      sourceHint: "Billboard",
    },
    {
      category: "music",
      region: "overseas",
      url: "https://www.nme.com/news/music/feed",
      sourceHint: "NME",
    },
  ];
}

function searchFeed(lang: Locale, category: Category, q: string, region?: "domestic" | "overseas"): Feed {
  const loc = GOOGLE_LOCALE[lang];
  return {
    category,
    region,
    sourceHint: loc.source,
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${loc.hl}&gl=${loc.gl}&ceid=${encodeURIComponent(loc.ceid)}`,
  };
}

const ENTERTAINMENT_QUERY: Record<Locale, string> = {
  ja: "芸能 OR 俳優 OR 女優 OR ドラマ OR 映画 OR アイドル",
  en: "celebrity OR Hollywood OR movie OR drama OR actor",
  zh: "娱乐 OR 演员 OR 电影 OR 电视剧",
  ko: "연예 OR 배우 OR 드라마 OR 영화",
};

function entertainmentFeeds(lang: Locale): Feed[] {
  return [
    searchFeed(lang, "entertainment", ENTERTAINMENT_QUERY[lang]),
    {
      category: "entertainment",
      url: "https://variety.com/feed/",
      sourceHint: "Variety",
    },
    {
      category: "entertainment",
      url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
      sourceHint: "BBC News",
    },
    {
      category: "entertainment",
      url: "https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml",
      sourceHint: "The New York Times",
    },
  ];
}

const ECONOMY_QUERY: Record<Locale, string> = {
  ja: "経済 OR 日銀 OR 為替 OR 株価 OR 企業",
  en: "economy OR stocks OR inflation OR central bank OR markets",
  zh: "经济 OR 股市 OR 汇率 OR 央行",
  ko: "경제 OR 주식 OR 환율 OR 기업",
};

function economyFeeds(lang: Locale): Feed[] {
  return [
    searchFeed(lang, "economy", ECONOMY_QUERY[lang]),
    {
      category: "economy",
      url: "https://feeds.bbci.co.uk/news/business/rss.xml",
      sourceHint: "BBC News",
    },
    {
      category: "economy",
      url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
      sourceHint: "The New York Times",
    },
  ];
}

function googleFeeds(lang: Locale): Feed[] {
  const loc = GOOGLE_LOCALE[lang];
  return TOPICS.map(({ category, topic }) => ({
    category,
    region: category === "politics" ? "domestic" : undefined,
    url: `https://news.google.com/rss/headlines/section/topic/${topic}?hl=${loc.hl}&gl=${loc.gl}&ceid=${encodeURIComponent(loc.ceid)}`,
    sourceHint: loc.source,
  }));
}

const POLITICS_QUERY: Record<Locale, { domestic: string; overseas: string }> = {
  ja: {
    domestic: "政治 OR 国会 OR 内閣 OR 選挙",
    overseas: "米政治 OR 中国 政治 OR 欧州 政治 OR 大統領",
  },
  en: {
    domestic: "Japan politics OR Diet OR Kishida OR Takaichi",
    overseas: "US politics OR China politics OR election OR parliament",
  },
  zh: {
    domestic: "日本 政治 国会",
    overseas: "美国 政治 OR 中国 政治 OR 选举",
  },
  ko: {
    domestic: "일본 정치 OR 국회",
    overseas: "미국 정치 OR 중국 정치 OR 대선",
  },
};

function politicsFeeds(lang: Locale): Feed[] {
  const loc = GOOGLE_LOCALE[lang];
  const q = POLITICS_QUERY[lang];
  return [
    {
      category: "politics",
      region: "domestic",
      sourceHint: loc.source,
      url: `https://news.google.com/rss/search?q=${encodeURIComponent(q.domestic)}&hl=${loc.hl}&gl=${loc.gl}&ceid=${encodeURIComponent(loc.ceid)}`,
    },
    {
      category: "politics",
      region: "overseas",
      sourceHint: loc.source,
      url: `https://news.google.com/rss/search?q=${encodeURIComponent(q.overseas)}&hl=${loc.hl}&gl=${loc.gl}&ceid=${encodeURIComponent(loc.ceid)}`,
    },
    {
      category: "politics",
      region: "overseas",
      url: "https://feeds.bbci.co.uk/news/politics/rss.xml",
      sourceHint: "BBC News",
    },
  ];
}

function eventSearchFeed(event: EventDef, lang: Locale): Feed {
  const loc = GOOGLE_LOCALE[lang];
  return {
    category: event.category,
    eventId: event.id,
    sourceHint: loc.source,
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(event.query[lang])}&hl=${loc.hl}&gl=${loc.gl}&ceid=${encodeURIComponent(loc.ceid)}`,
  };
}

const WIRE_FEEDS: Feed[] = [
  {
    category: "world",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    sourceHint: "BBC News",
  },
  {
    category: "world",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    sourceHint: "The New York Times",
  },
  {
    category: "world",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    sourceHint: "Al Jazeera",
  },
];

const DISASTER_FEEDS: Feed[] = [
  {
    category: "world",
    eventId: DISASTER_EVENT_ID,
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_hour.atom",
    sourceHint: "USGS",
  },
  {
    category: "world",
    eventId: DISASTER_EVENT_ID,
    url: "https://www.data.jma.go.jp/developer/xml/feed/eqvol.xml",
    sourceHint: "気象庁",
  },
  {
    category: "world",
    eventId: DISASTER_EVENT_ID,
    url: "https://news.yahoo.co.jp/rss/topics/weather.xml",
    sourceHint: "Yahoo!ニュース",
  },
];

function categoryBackupFeeds(lang: Locale): Record<Category, Feed[]> {
  const loc = GOOGLE_LOCALE[lang];
  const google = (category: Category, topic: string): Feed => ({
    category,
    sourceHint: loc.source,
    url: `https://news.google.com/rss/headlines/section/topic/${topic}?hl=${loc.hl}&gl=${loc.gl}&ceid=${encodeURIComponent(loc.ceid)}`,
  });
  return {
    world: [google("world", "WORLD")],
    entertainment: entertainmentFeeds(lang).slice(0, 2),
    music: [musicFeeds(lang)[0], musicFeeds(lang)[1]],
    politics: [politicsFeeds(lang)[0], politicsFeeds(lang)[1]],
    sports: [google("sports", "SPORTS")],
    economy: economyFeeds(lang).slice(0, 2),
  };
}

function feedsFor(lang: Locale): { core: Feed[]; extra: Feed[] } {
  const scheduled = scheduledEvents();
  const alerts = scheduled.filter((event) => event.always).map((event) => eventSearchFeed(event, lang));
  const extras = scheduled.filter((event) => !event.always).map((event) => eventSearchFeed(event, lang));
  const music = musicFeeds(lang);
  const politics = politicsFeeds(lang);
  const entertainment = entertainmentFeeds(lang);
  const economy = economyFeeds(lang);
  if (lang === "ja") {
    return {
      core: [
        ...YAHOO_JA,
        politics[0],
        politics[1],
        music[0],
        music[1],
        entertainment[0],
        economy[0],
        NHK_JA[0],
        DISASTER_FEEDS[0],
      ],
      extra: [
        ...googleFeeds("ja"),
        ...music.slice(2),
        politics[2],
        ...entertainment.slice(1),
        ...economy.slice(1),
        ...NHK_JA.slice(1),
        ...WIRE_FEEDS,
        ...DISASTER_FEEDS.slice(1),
        ...alerts,
        ...extras,
      ],
    };
  }
  return {
    core: [
      ...googleFeeds(lang),
      music[0],
      music[1],
      politics[0],
      politics[1],
      entertainment[0],
      economy[0],
      DISASTER_FEEDS[0],
    ],
    extra: [
      ...music.slice(2),
      politics[2],
      ...entertainment.slice(1),
      ...economy.slice(1),
      ...WIRE_FEEDS,
      ...DISASTER_FEEDS.slice(1),
      ...alerts,
      ...extras,
    ],
  };
}

const CACHE_MS = 45 * 1000;
const STALE_MS = 30 * 60 * 1000;
const CACHE_GEN = 22;
const cache = new Map<Locale, { at: number; gen: number; payload: NewsPayload }>();
const inflight = new Map<Locale, Promise<NewsPayload>>();
const enriching = new Map<Locale, Promise<void>>();
const articleIndex = new Map<string, { at: number; article: NewsArticle }>();

function tagText(block: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = block.match(re);
  return match ? match[1] : "";
}

function hashId(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function parseSource(
  title: string,
  fallback: string,
  block: string,
): { title: string; source: string } {
  const sourceTag = safeText(stripTags(tagText(block, "source")), 80);
  const dash = title.lastIndexOf(" - ");
  if (dash > 8 && dash < title.length - 2) {
    return { title: title.slice(0, dash).trim(), source: title.slice(dash + 3).trim() };
  }
  if (sourceTag) return { title, source: sourceTag };
  return { title, source: fallback };
}

function attr(block: string, tag: string, name: string): string {
  const re = new RegExp(`<${tag}\\b[^>]*\\s${name}="([^"]+)"[^>]*>`, "i");
  return re.exec(block)?.[1] ?? "";
}

function parseFeed(xml: string, category: Category, sourceHint: string): NewsArticle[] {
  const items: NewsArticle[] = [];
  const re = /<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml))) {
    const block = match[2];
    const rawTitle = safeText(stripTags(tagText(block, "title")), 280);
    const link = safeHttpUrl(
      attr(block, "link", "href") || tagText(block, "link") || tagText(block, "guid") || tagText(block, "id"),
    );
    if (!rawTitle || !link) continue;
    if (items.length >= 80) break;
    const { title, source } = parseSource(rawTitle, sourceHint, block);
    const pub =
      stripTags(tagText(block, "pubDate") || tagText(block, "updated") || tagText(block, "published") || tagText(block, "dc:date"));
    const publishedMs = pub ? Date.parse(pub) : 0;
    const rawSummary = tagText(block, "description") || tagText(block, "summary") || tagText(block, "content");
    items.push({
      id: hashId(link),
      title,
      link,
      source: safeText(source || sourceHint, 80),
      publishedAt: Number.isFinite(publishedMs)
        ? new Date(publishedMs).toISOString()
        : new Date().toISOString(),
      publishedMs: Number.isFinite(publishedMs) && publishedMs > 0 ? publishedMs : 0,
      category,
      summary: cleanSummary(rawSummary),
    });
  }
  return items;
}

async function fetchFeed(url: string, ms = 1800): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; InhoNews/1.0; +https://grok.com) AppleWebKit/537.36",
        accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(ms),
    });
    if (!res.ok) return null;
    const len = Number(res.headers.get("content-length") ?? 0);
    if (len > 800_000) return null;
    const xml = await res.text();
    if (xml.length > 800_000) return xml.slice(0, 800_000);
    return xml;
  } catch {
    return null;
  }
}

function mergeArticles(into: NewsArticle[], seen: Set<string>, list: NewsArticle[]) {
  const byId = new Map(into.map((a) => [a.id, a] as const));
  const byTitle = new Map(into.map((a) => [a.title.replace(/\s+/g, ""), a] as const));
  for (const article of list) {
    const key = article.title.replace(/\s+/g, "");
    const existing = byId.get(article.id) || byTitle.get(key);
    if (existing) {
      if (article.eventIds) existing.eventIds = [...new Set([...(existing.eventIds ?? []), ...article.eventIds])];
      if (article.sports) existing.sports = [...new Set([...(existing.sports ?? []), ...article.sports])];
      if (article.region && !existing.region) existing.region = article.region;
      continue;
    }
    if (seen.has(key) || seen.has(article.id)) continue;
    seen.add(key);
    seen.add(article.id);
    into.push(article);
    byId.set(article.id, article);
    byTitle.set(key, article);
  }
}

function classifyRegion(article: NewsArticle, cat: "music" | "politics"): "domestic" | "overseas" {
  const hay = `${article.source} ${article.link} ${article.title} ${article.originalTitle ?? ""}`;
  if (/billboard|nme\.com|pitchfork|bbc|nytimes|reuters|washingtonpost|aljazeera/i.test(hay)) return "overseas";
  if (/yahoo\.co\.jp|nhk\.or\.jp|oricon|barks|natalie\.mu|go\.jp|オリコン|国会|内閣/i.test(hay)) return "domestic";
  if (/[\u3040-\u30ff]/.test(article.title) || /[\u3040-\u30ff]/.test(article.originalTitle ?? "")) return "domestic";
  if (cat === "politics" && /white house|congress|beijing|kremlin|eu /i.test(hay)) return "overseas";
  return "overseas";
}

function tagRegions(articles: NewsArticle[]) {
  for (const article of articles) {
    if (article.category !== "music" && article.category !== "politics") continue;
    article.region = article.region ?? classifyRegion(article, article.category);
  }
}

async function readFeed(feed: Feed, ms?: number) {
  const xml = await fetchFeed(feed.url, ms);
  if (!xml) return [] as NewsArticle[];
  const items = parseFeed(xml, feed.category, feed.sourceHint);
  if (feed.eventId) {
    for (const item of items) item.eventIds = [feed.eventId];
  }
  if (feed.region) {
    for (const item of items) item.region = feed.region;
  }
  return items;
}

function rememberArticles(list: NewsArticle[]) {
  const at = Date.now();
  for (const article of list) articleIndex.set(article.id, { at, article });
  if (articleIndex.size > 900) {
    const ordered = [...articleIndex.entries()].sort((a, b) => a[1].at - b[1].at);
    for (const [id] of ordered.slice(0, articleIndex.size - 700)) articleIndex.delete(id);
  }
}

function storePayload(lang: Locale, payload: NewsPayload): NewsPayload {
  rememberArticles(payload.articles);
  const prev = cache.get(lang);
  if (prev?.gen === CACHE_GEN && prev.payload.articles.length > payload.articles.length) {
    const seen = new Set<string>();
    const merged: NewsArticle[] = [];
    mergeArticles(merged, seen, payload.articles);
    mergeArticles(merged, seen, prev.payload.articles);
    const next = finishPayload(merged);
    cache.set(lang, { at: Date.now(), gen: CACHE_GEN, payload: next });
    return next;
  }
  cache.set(lang, { at: Date.now(), gen: CACHE_GEN, payload });
  return payload;
}

function finishPayload(articles: NewsArticle[]): NewsPayload {
  tagRegions(articles);
  articles.sort((a, b) => b.publishedMs - a.publishedMs);
  const picked: NewsArticle[] = [];
  const seen = new Set<string>();
  const quota = 24;
  for (const cat of CATEGORIES) {
    if (cat === "music" || cat === "politics") {
      for (const region of ["overseas", "domestic"] as const) {
        let n = 0;
        for (const article of articles) {
          if (article.category !== cat || article.region !== region || seen.has(article.id)) continue;
          picked.push(article);
          seen.add(article.id);
          n += 1;
          if (n >= 12) break;
        }
      }
      continue;
    }
    let n = 0;
    for (const article of articles) {
      if (article.category !== cat || seen.has(article.id)) continue;
      picked.push(article);
      seen.add(article.id);
      n += 1;
      if (n >= quota) break;
    }
  }
  for (const article of articles) {
    if (seen.has(article.id)) continue;
    picked.push(article);
    seen.add(article.id);
    if (picked.length >= 280) break;
  }
  tagArticles(picked);
  tagSports(picked);
  tagRegions(picked);
  tagImpact(picked);
  rememberArticles(articles);
  return {
    fetchedAt: new Date().toISOString(),
    articles: picked,
    events: activeEvents(picked),
  };
}

async function gatherFeeds(feeds: Feed[], budgetMs: number, timeoutMs: number): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = [];
  const seen = new Set<string>();
  return await new Promise<NewsArticle[]>((resolve) => {
    let open = true;
    const finish = () => {
      if (!open) return;
      open = false;
      resolve(articles.slice());
    };
    const timer = setTimeout(finish, budgetMs);
    let left = feeds.length;
    if (left === 0) {
      clearTimeout(timer);
      finish();
      return;
    }
    for (const feed of feeds) {
      void readFeed(feed, timeoutMs).then((list) => {
        if (!open) return;
        mergeArticles(articles, seen, list);
        left -= 1;
        if (left <= 0) {
          clearTimeout(timer);
          finish();
        }
      });
    }
  });
}

async function fillMissingRegions(lang: Locale, articles: NewsArticle[]): Promise<NewsArticle[]> {
  tagRegions(articles);
  const need: Feed[] = [];
  const music = articles.filter((a) => a.category === "music");
  const musicList = musicFeeds(lang);
  if (!music.some((a) => a.region === "domestic")) need.push(musicList[0]);
  if (!music.some((a) => a.region === "overseas")) need.push(musicList[1], musicList[2]);
  const politics = articles.filter((a) => a.category === "politics");
  const politicsList = politicsFeeds(lang);
  if (!politics.some((a) => a.region === "domestic")) need.push(politicsList[0]);
  if (!politics.some((a) => a.region === "overseas")) need.push(politicsList[1], politicsList[2]);
  if (need.length === 0) return articles;
  const extra = await gatherFeeds(need, 1200, 1600);
  const seen = new Set<string>();
  const merged: NewsArticle[] = [];
  mergeArticles(merged, seen, articles);
  mergeArticles(merged, seen, extra);
  tagRegions(merged);
  return merged;
}

async function fillMissingCategories(lang: Locale, articles: NewsArticle[]): Promise<NewsArticle[]> {
  const thin = CATEGORIES.filter((cat) => articles.filter((a) => a.category === cat).length < 12);
  let next = articles;
  if (thin.length > 0) {
    const backups = categoryBackupFeeds(lang);
    const feeds = thin.flatMap((cat) => backups[cat]);
    const extra = await gatherFeeds(feeds, 1400, 1800);
    const seen = new Set<string>();
    const merged: NewsArticle[] = [];
    mergeArticles(merged, seen, articles);
    mergeArticles(merged, seen, extra);
    next = merged;
  }
  return fillMissingRegions(lang, next);
}

async function loadNewsUncached(lang: Locale): Promise<NewsPayload> {
  const { core, extra } = feedsFor(lang);
  let first = await gatherFeeds(core, 1100, 1600);
  first = await fillMissingCategories(lang, first);
  applyCachedTranslations(first, lang);
  const payload = finishPayload(first);
  const job = enrichNews(lang, payload, extra);
  enriching.set(lang, job);
  void job.finally(() => {
    if (enriching.get(lang) === job) enriching.delete(lang);
  });
  return payload;
}

async function enrichNews(lang: Locale, base: NewsPayload, extra: Feed[]) {
  try {
    const extraResults = await gatherFeeds(extra, 2200, 1600);
    const seen = new Set<string>();
    const articles: NewsArticle[] = [];
    mergeArticles(articles, seen, base.articles);
    mergeArticles(articles, seen, extraResults);
    const filled = await fillMissingCategories(lang, articles);
    await localizeWorldArticles(filled, lang, { max: 24, grok: true, budgetMs: 8000 });
    storePayload(lang, finishPayload(filled));
  } catch {
    /* keep the fast payload */
  }
}

const EMPTY_NEWS: NewsPayload = { fetchedAt: new Date(0).toISOString(), articles: [], events: [] };

function refresh(lang: Locale): Promise<NewsPayload> {
  const existing = inflight.get(lang);
  if (existing) return existing;
  const next = loadNewsUncached(lang)
    .then((payload) => storePayload(lang, payload))
    .catch(() => {
      const hit = cache.get(lang);
      return hit?.payload ?? { ...EMPTY_NEWS, fetchedAt: new Date().toISOString() };
    })
    .finally(() => {
      inflight.delete(lang);
    });
  inflight.set(lang, next);
  return next;
}

async function loadNews(lang: Locale): Promise<NewsPayload> {
  const hit = cache.get(lang);
  const now = Date.now();
  if (hit && hit.gen === CACHE_GEN) {
    if (now - hit.at < CACHE_MS) return hit.payload;
    if (now - hit.at < STALE_MS) {
      void refresh(lang);
      return hit.payload;
    }
  }
  return refresh(lang);
}

function findCachedArticle(id: string): NewsArticle | null {
  const indexed = articleIndex.get(id);
  if (indexed && Date.now() - indexed.at < STALE_MS) return indexed.article;
  for (const lang of LOCALES) {
    const hit = cache.get(lang)?.payload.articles.find((a) => a.id === id);
    if (hit) return hit;
  }
  return null;
}

export const getNews = createServerFn({ method: "POST" })
  .validator((data: { lang?: string } | undefined) => ({ lang: parseLocale(data?.lang) }))
  .handler(async ({ data }): Promise<NewsPayload> => {
    try {
      return await loadNews(data.lang);
    } catch {
      return { fetchedAt: new Date().toISOString(), articles: [], events: [] };
    }
  });

export const getArticle = createServerFn({ method: "POST" })
  .validator((data: { id: string; lang?: string }) => ({
    id: isArticleId(data.id) ? data.id : "",
    lang: parseLocale(data.lang),
  }))
  .handler(async ({ data }): Promise<NewsArticle | null> => {
    if (!data.id) return null;
    const cached = findCachedArticle(data.id);
    if (cached) return cached;
    const payload = await loadNews(data.lang);
    const fromList = payload.articles.find((a) => a.id === data.id);
    if (fromList) return fromList;
    await Promise.race([
      enriching.get(data.lang) ?? Promise.resolve(),
      new Promise<void>((resolve) => setTimeout(resolve, 2500)),
    ]);
    return findCachedArticle(data.id);
  });

const sportCache = new Map<string, { at: number; articles: NewsArticle[] }>();

export const getSportNews = createServerFn({ method: "POST" })
  .validator((data: { sport: string; lang?: string }) => ({
    sport: /^[a-z0-9-]{1,32}$/.test(String(data.sport ?? "")) ? String(data.sport) : "",
    lang: parseLocale(data.lang),
  }))
  .handler(async ({ data }): Promise<NewsArticle[]> => {
    const sport = data.sport ? sportById(data.sport) : undefined;
    if (!sport) return [];
    const key = `${data.lang}:${sport.id}`;
    const hit = sportCache.get(key);
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.articles;
    const loc = GOOGLE_LOCALE[data.lang];
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(sport.query[data.lang])}&hl=${loc.hl}&gl=${loc.gl}&ceid=${encodeURIComponent(loc.ceid)}`;
    const xml = await fetchFeed(url);
    if (!xml) return hit?.articles ?? [];
    const articles = parseFeed(xml, "sports", loc.source).slice(0, 24);
    for (const article of articles) article.sports = [sport.id];
    tagSports(articles);
    rememberArticles(articles);
    sportCache.set(key, { at: Date.now(), articles });
    return articles;
  });

export { CATEGORY_META };
