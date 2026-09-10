import type { Locale } from "@/lib/i18n/locales";
import type { Category, NewsArticle } from "./types";

export type EventDef = {
  id: string;
  kicker: string;
  category: Category;
  start: string;
  end: string;
  always?: boolean;
  labels: Record<Locale, string>;
  blurbs: Record<Locale, string>;
  keywords: RegExp;
  query: Record<Locale, string>;
};

export const DISASTER_EVENT_ID = "disaster-alert";

export const EVENT_CATALOG: EventDef[] = [
  {
    id: DISASTER_EVENT_ID,
    kicker: "ALERT",
    category: "world",
    always: true,
    start: "2020-01-01",
    end: "2099-12-31",
    labels: { ja: "地震・災害", en: "Quake & disaster", zh: "地震与灾害", ko: "지진·재해" },
    blurbs: {
      ja: "地震・津波・台風など自然災害の速報",
      en: "Earthquakes, tsunamis, storms, and other disasters",
      zh: "地震、海啸、台风等自然灾害快讯",
      ko: "지진·쓰나미·태풍 등 자연재해 속보",
    },
    keywords:
      /緊急地震速報|地震|震度|津波|台風|豪雨|噴火|土砂災害|避難指示|避難勧告|地震速報|earthquake|\bquake\b|tsunami|typhoon|hurricane|cyclone|wildfire|volcano|eruption|flood|evacuation|aftershock|지진|쓰나미|태풍|화산|대피|지진속보|海啸|台风|暴雨|地震|火山喷发|避难/i,
    query: {
      ja: "地震 OR 津波 OR 台風 OR 噴火 OR 緊急地震速報",
      en: "earthquake OR tsunami OR typhoon OR wildfire OR volcano",
      zh: "地震 OR 海啸 OR 台风 OR 火山",
      ko: "지진 OR 쓰나미 OR 태풍 OR 화산",
    },
  },
  {
    id: "emmys-2026",
    kicker: "EMMYS",
    category: "entertainment",
    start: "2026-08-15",
    end: "2026-09-30",
    labels: { ja: "エミー賞", en: "Emmys", zh: "艾美奖", ko: "에미상" },
    blurbs: {
      ja: "プライムタイム・エミー賞と受賞作の話題",
      en: "Primetime Emmy Awards and the shows in the race",
      zh: "艾美奖颁奖与入围剧集",
      ko: "프라임타임 에미상과 수상작",
    },
    keywords: /emmy|エミー|艾美|에미상/i,
    query: {
      ja: "エミー賞 OR Emmys 2026",
      en: "Emmy Awards 2026",
      zh: "艾美奖 2026",
      ko: "에미상 2026",
    },
  },
  {
    id: "tgs-2026",
    kicker: "TGS",
    category: "entertainment",
    start: "2026-09-01",
    end: "2026-09-30",
    labels: { ja: "東京ゲームショウ", en: "Tokyo Game Show", zh: "东京电玩展", ko: "도쿄 게임쇼" },
    blurbs: {
      ja: "東京ゲームショウ2026 新作と配信発表",
      en: "Tokyo Game Show 2026 announcements",
      zh: "2026东京电玩展新作发表",
      ko: "도쿄 게임쇼 2026 신작 발표",
    },
    keywords: /tokyo\s*game\s*show|ゲームショウ|電玩展|게임쇼|\btgs\b/i,
    query: {
      ja: "東京ゲームショウ OR TGS 2026",
      en: "Tokyo Game Show 2026",
      zh: "东京电玩展 2026",
      ko: "도쿄 게임쇼 2026",
    },
  },
  {
    id: "fall-music-2026",
    kicker: "MUSIC",
    category: "music",
    start: "2026-09-01",
    end: "2026-11-30",
    labels: { ja: "新譜・ライブ", en: "Albums & tours", zh: "新专辑与巡演", ko: "신보·공연" },
    blurbs: {
      ja: "秋の新譜、ツアー、音楽賞の話題",
      en: "Fall albums, tours, and music awards",
      zh: "秋季新专辑、巡演与音乐奖",
      ko: "가을 신보·투어·음악 시상",
    },
    keywords: /新譜|新曲|アルバム|ライブ|ツアー|billboard|コンサート|album|world\s*tour|comeback|신곡|앨범|콘서트|演唱会|专辑|巡演/i,
    query: {
      ja: "新譜 OR ライブ OR アルバム 2026",
      en: "new album OR world tour 2026",
      zh: "新专辑 巡演 2026",
      ko: "신보 OR 월드투어 2026",
    },
  },
  {
    id: "fall-drama-2026",
    kicker: "FALL TV",
    category: "entertainment",
    start: "2026-09-01",
    end: "2026-10-31",
    labels: { ja: "秋ドラマ", en: "Fall dramas", zh: "秋季档", ko: "가을 드라마" },
    blurbs: {
      ja: "秋の新ドラマ・映画・音楽の開幕",
      en: "Fall TV, film, and music season",
      zh: "秋季影视与音乐档期",
      ko: "가을 드라마·영화·음악 시즌",
    },
    keywords: /秋ドラマ|秋の新番組|fall\s*(tv|drama)|秋季档|가을\s*드라마|新番組/i,
    query: {
      ja: "秋ドラマ OR 新番組",
      en: "fall TV premiere 2026",
      zh: "秋季档 电视剧",
      ko: "가을 드라마 2026",
    },
  },
  {
    id: "unga-2026",
    kicker: "UNGA",
    category: "politics",
    start: "2026-09-01",
    end: "2026-10-05",
    labels: { ja: "国連総会", en: "UN Assembly", zh: "联大", ko: "유엔총회" },
    blurbs: {
      ja: "第81回国連総会と首脳外交",
      en: "81st UN General Assembly and world leaders week",
      zh: "第81届联合国大会与元首周",
      ko: "제81차 유엔총회와 정상 외교",
    },
    keywords: /un(ited nations)?\s*(general\s*)?assembly|国連総会|联大|유엔총회|\bunga\b|climate week/i,
    query: {
      ja: "国連総会 OR UNGA",
      en: "UN General Assembly 2026",
      zh: "联合国大会 2026",
      ko: "유엔총회 2026",
    },
  },
  {
    id: "midterms-2026",
    kicker: "MIDTERMS",
    category: "politics",
    start: "2026-08-01",
    end: "2026-11-15",
    labels: { ja: "米中間選挙", en: "US midterms", zh: "美国中期选举", ko: "미국 중간선거" },
    blurbs: {
      ja: "2026年米国中間選挙の情勢",
      en: "2026 United States midterm elections",
      zh: "2026年美国中期选举",
      ko: "2026 미국 중간선거",
    },
    keywords: /midterm|中間選挙|中期选举|중간선거|congress(ional)?\s+race|ハウス|上院/i,
    query: {
      ja: "米中間選挙 OR midterms 2026",
      en: "US midterms 2026",
      zh: "美国中期选举 2026",
      ko: "미국 중간선거 2026",
    },
  },
  {
    id: "worldcup-2026",
    kicker: "WORLD CUP",
    category: "sports",
    start: "2026-05-15",
    end: "2026-09-30",
    labels: { ja: "W杯2026", en: "World Cup", zh: "世界杯", ko: "월드컵" },
    blurbs: {
      ja: "FIFAワールドカップ2026 特集",
      en: "FIFA World Cup 2026 special desk",
      zh: "2026年世界杯特辑",
      ko: "FIFA 월드컵 2026 특집",
    },
    keywords: /world\s*cup|ワールドカップ|Ｗ杯|W杯|世界杯|월드컵|fifa\s*2026/i,
    query: {
      ja: "ワールドカップ OR W杯 OR World Cup 2026",
      en: "FIFA World Cup 2026",
      zh: "世界杯 2026",
      ko: "월드컵 2026",
    },
  },
  {
    id: "asiangames-2026",
    kicker: "ASIAN GAMES",
    category: "sports",
    start: "2026-08-20",
    end: "2026-10-20",
    labels: { ja: "アジア大会", en: "Asian Games", zh: "亚运会", ko: "아시안게임" },
    blurbs: {
      ja: "愛知・名古屋 アジア競技大会2026",
      en: "Aichi-Nagoya Asian Games 2026",
      zh: "爱知名古屋亚运会2026",
      ko: "아이치·나고야 아시안게임 2026",
    },
    keywords: /asian\s*games|アジア競技大会|アジア大会|亚运会|아시안게임/i,
    query: {
      ja: "アジア競技大会 OR アジア大会 2026",
      en: "Asian Games 2026 Nagoya",
      zh: "亚运会 2026",
      ko: "아시안게임 2026",
    },
  },
  {
    id: "mlb-2026",
    kicker: "MLB",
    category: "sports",
    start: "2026-09-01",
    end: "2026-11-10",
    labels: { ja: "MLB", en: "MLB", zh: "MLB", ko: "MLB" },
    blurbs: {
      ja: "メジャーリーグ シーズン終盤とポストシーズン",
      en: "MLB stretch run and postseason",
      zh: "美国职棒冲刺与季后赛",
      ko: "메이저리그 막판과 포스트시즌",
    },
    keywords: /mlb|world\s*series|ポストシーズン|季后赛|포스트시즌|ヤンキース|ドジャース/i,
    query: {
      ja: "MLB OR メジャーリーグ",
      en: "MLB playoffs OR World Series",
      zh: "MLB 季后赛",
      ko: "MLB 포스트시즌",
    },
  },
  {
    id: "fed-boj-2026",
    kicker: "CENTRAL BANKS",
    category: "economy",
    start: "2026-08-01",
    end: "2026-12-20",
    labels: { ja: "日銀・FRB", en: "Fed & BOJ", zh: "美联储与日银", ko: "연준·일본은행" },
    blurbs: {
      ja: "日銀とFRBの金利・為替の焦点",
      en: "Federal Reserve and Bank of Japan policy",
      zh: "美联储与日本银行的利率动向",
      ko: "연준과 일본은행의 금리·환율",
    },
    keywords: /federal reserve|\bfed\b|frb|日銀|日本銀行|boj|利率|利上げ|利下げ|美联储|연준|기준금리/i,
    query: {
      ja: "日銀 OR FRB OR 金利",
      en: "Federal Reserve OR Bank of Japan rates",
      zh: "美联储 日本银行 利率",
      ko: "연준 OR 일본은행 금리",
    },
  },
  {
    id: "markets-2026",
    kicker: "MARKETS",
    category: "economy",
    start: "2026-08-01",
    end: "2026-12-31",
    labels: { ja: "市場・為替", en: "Markets", zh: "市场与汇率", ko: "시장·환율" },
    blurbs: {
      ja: "株・為替・原油の動き",
      en: "Stocks, FX, and oil",
      zh: "股市、汇率与原油",
      ko: "증시·환율·원유",
    },
    keywords: /為替|円安|円高|日経|ダウ|nasdaq|原油|oil\s*price|股市|汇率|환율|닛케이/i,
    query: {
      ja: "為替 OR 日経平均 OR 原油",
      en: "stock market OR yen OR oil prices",
      zh: "股市 汇率 原油",
      ko: "환율 OR 증시 OR 원유",
    },
  },
];

export function isEventInWindow(event: EventDef, now = new Date()): boolean {
  if (event.always) return true;
  const t = now.getTime();
  return t >= Date.parse(`${event.start}T00:00:00Z`) && t <= Date.parse(`${event.end}T23:59:59Z`);
}

export function articleMatchesEvent(article: NewsArticle, event: EventDef): boolean {
  const hay = `${article.title} ${article.originalTitle ?? ""} ${article.summary}`;
  return event.keywords.test(hay);
}

export function tagArticles(articles: NewsArticle[]): NewsArticle[] {
  for (const article of articles) {
    const ids = EVENT_CATALOG.filter((event) => articleMatchesEvent(article, event)).map((e) => e.id);
    article.eventIds = [...new Set([...(article.eventIds ?? []), ...ids])];
    if (article.eventIds.length === 0) article.eventIds = undefined;
  }
  return articles;
}

export function activeEvents(articles: NewsArticle[], now = new Date()) {
  return EVENT_CATALOG.filter((event) => {
    const hits = articles.filter((a) => a.eventIds?.includes(event.id)).length;
    if (event.always) return hits >= 1;
    return isEventInWindow(event, now) || hits >= 2;
  }).map((event) => ({
    id: event.id,
    kicker: event.kicker,
    category: event.category,
    label: event.labels,
    blurb: event.blurbs,
    count: articles.filter((a) => a.eventIds?.includes(event.id)).length,
  }));
}

export function scheduledEvents(now = new Date()) {
  return EVENT_CATALOG.filter((event) => isEventInWindow(event, now));
}
