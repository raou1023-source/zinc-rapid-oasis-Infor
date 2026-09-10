import type { Locale } from "@/lib/i18n/locales";
import type { NewsArticle } from "./types";

export type SportDef = {
  id: string;
  labels: Record<Locale, string>;
  aliases: string[];
  query: Record<Locale, string>;
};

export const SPORTS: SportDef[] = [
  {
    id: "soccer",
    labels: { ja: "サッカー", en: "Football", zh: "足球", ko: "축구" },
    aliases: ["soccer", "football", "プレミアリーグ", "premier league", "jリーグ", "j-league", "サッカー", "フットボール", "ワールドカップ", "world cup", "fifa", "足球", "축구", "epl", "laliga", "ラ・リーガ", "セリエ", "bundesliga"],
    query: { ja: "サッカー OR Jリーグ OR プレミアリーグ", en: "soccer OR football OR Premier League", zh: "足球 英超", ko: "축구 OR 프리미어리그" },
  },
  {
    id: "baseball",
    labels: { ja: "野球", en: "Baseball", zh: "棒球", ko: "야구" },
    aliases: ["baseball", "mlb", "npb", "野球", "プロ野球", "メジャー", "大谷", "ohtani", "棒球", "야구", "kbo", "wbc"],
    query: { ja: "野球 OR プロ野球 OR MLB", en: "baseball OR MLB OR NPB", zh: "棒球 MLB", ko: "야구 OR MLB" },
  },
  {
    id: "basketball",
    labels: { ja: "バスケ", en: "Basketball", zh: "篮球", ko: "농구" },
    aliases: ["basketball", "nba", "バスケ", "バスケット", "bリーグ", "b.league", "篮球", "농구"],
    query: { ja: "バスケ OR NBA OR Bリーグ", en: "basketball OR NBA", zh: "篮球 NBA", ko: "농구 OR NBA" },
  },
  {
    id: "tennis",
    labels: { ja: "テニス", en: "Tennis", zh: "网球", ko: "테니스" },
    aliases: ["tennis", "テニス", "wimbledon", "ウィンブルドン", "全米オープン", "全豪", "全仏", "网球", "테니스"],
    query: { ja: "テニス OR グランドスラム", en: "tennis OR Grand Slam", zh: "网球", ko: "테니스" },
  },
  {
    id: "golf",
    labels: { ja: "ゴルフ", en: "Golf", zh: "高尔夫", ko: "골프" },
    aliases: ["golf", "ゴルフ", "pga", "lpga", "masters", "マスターズ", "高尔夫", "골프"],
    query: { ja: "ゴルフ OR PGA", en: "golf OR PGA", zh: "高尔夫", ko: "골프" },
  },
  {
    id: "f1",
    labels: { ja: "F1", en: "F1", zh: "F1", ko: "F1" },
    aliases: ["formula 1", "formula one", "f1", "グランプリ", "grand prix", "motogp"],
    query: { ja: "F1 OR フォーミュラ1", en: "F1 OR Formula 1", zh: "F1 一级方程式", ko: "F1 OR 포뮬러1" },
  },
  {
    id: "volleyball",
    labels: { ja: "バレー", en: "Volleyball", zh: "排球", ko: "배구" },
    aliases: ["volleyball", "バレー", "バレーボール", "vリーグ", "排球", "배구"],
    query: { ja: "バレーボール OR Vリーグ", en: "volleyball", zh: "排球", ko: "배구" },
  },
  {
    id: "rugby",
    labels: { ja: "ラグビー", en: "Rugby", zh: "橄榄球", ko: "럭비" },
    aliases: ["rugby", "ラグビー", "six nations", "橄榄球", "럭비"],
    query: { ja: "ラグビー", en: "rugby", zh: "橄榄球 英式", ko: "럭비" },
  },
  {
    id: "american-football",
    labels: { ja: "アメフト", en: "NFL", zh: "美式橄榄球", ko: "미식축구" },
    aliases: ["nfl", "super bowl", "スーパーボウル", "アメフト", "アメリカンフットボール", "美式橄榄球", "미식축구"],
    query: { ja: "NFL OR アメフト", en: "NFL OR Super Bowl", zh: "NFL 美式橄榄球", ko: "NFL" },
  },
  {
    id: "combat",
    labels: { ja: "格闘技", en: "Combat", zh: "格斗", ko: "격투기" },
    aliases: ["boxing", "mma", "ufc", "ボクシング", "格闘技", "k-1", "相撲", "sumo", "柔道", "judo", "格斗", "拳击", "격투기", "복싱"],
    query: { ja: "格闘技 OR ボクシング OR UFC", en: "boxing OR UFC OR MMA", zh: "拳击 UFC", ko: "격투기 OR UFC" },
  },
  {
    id: "tabletennis",
    labels: { ja: "卓球", en: "Table tennis", zh: "乒乓球", ko: "탁구" },
    aliases: ["table tennis", "卓球", "ピンポン", "乒乓球", "탁구"],
    query: { ja: "卓球", en: "table tennis", zh: "乒乓球", ko: "탁구" },
  },
  {
    id: "athletics",
    labels: { ja: "陸上", en: "Athletics", zh: "田径", ko: "육상" },
    aliases: ["athletics", "track and field", "陸上", "マラソン", "marathon", "田径", "육상"],
    query: { ja: "陸上 OR マラソン", en: "athletics OR marathon", zh: "田径 马拉松", ko: "육상 OR 마라톤" },
  },
];

export function sportById(id: string): SportDef | undefined {
  return SPORTS.find((sport) => sport.id === id);
}

export function matchSports(text: string): string[] {
  const hay = text.toLowerCase();
  return SPORTS.filter((sport) => sport.aliases.some((alias) => hay.includes(alias.toLowerCase()))).map((s) => s.id);
}

export function findSportsByQuery(query: string): SportDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SPORTS.filter((sport) => {
    if (sport.aliases.some((alias) => alias.toLowerCase().includes(q) || q.includes(alias.toLowerCase()))) return true;
    return Object.values(sport.labels).some((label) => label.toLowerCase().includes(q));
  });
}

export function tagSports(articles: NewsArticle[]): NewsArticle[] {
  for (const article of articles) {
    if (article.category !== "sports") continue;
    const ids = matchSports(`${article.title} ${article.originalTitle ?? ""} ${article.summary}`);
    article.sports = ids.length > 0 ? ids : undefined;
  }
  return articles;
}

export function rankBySport(articles: NewsArticle[], sportIds: string[]): NewsArticle[] {
  if (sportIds.length === 0) return articles;
  const want = new Set(sportIds);
  return [...articles].sort((a, b) => {
    const am = a.sports?.some((id) => want.has(id)) ? 1 : 0;
    const bm = b.sports?.some((id) => want.has(id)) ? 1 : 0;
    if (am !== bm) return bm - am;
    return b.publishedMs - a.publishedMs;
  });
}
