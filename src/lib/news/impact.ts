import type { NewsArticle } from "./types";
import { DISASTER_EVENT_ID } from "./events";

export type ImpactHit = {
  score: number;
  urgent: boolean;
  kind: "disaster" | "crisis" | "breaking";
};

const DISASTER =
  /緊急地震速報|震度|津波|避難指示|地震|earthquake|\bquake\b|tsunami|hurricane|typhoon|wildfire|eruption|지진|쓰나미|해일|海啸|台风|台風|噴火/i;
const CRISIS =
  /戦争|開戦|停戦|核|ミサイル|クーデター|暗殺|テロ|侵攻|空爆|宣戦|invasion|assassination|coup|nuclear|missile|ceasefire|martial law|전쟁|암살|政变|开战|爆発|explosion/i;
const SHOCK =
  /速報|breaking|just in|暴落|急落|急騰|利上げ|利下げ|解散|総辞職|死去|死亡|逝去|当選|ノーベル|辞任|crash|plunge|rate (cut|hike)|resigns|impeach|dies\b|passed away|당선|사망|暴跌|辞职|逮捕|発砲|優勝|決勝/i;
const PROFILE =
  /トランプ|習近平|プーチン|金正恩|石破|高市|天皇|首相|大統領|ゼレンスキー|ネタニヤフ|\btrump\b|xi jinping|\bputin\b|kim jong|ishiba|takaichi|zelensky|netanyahu|大谷|ohtani|日銀|federal reserve|\bpowell\b|植田|岸田|frb|nato|国連/i;
const WIRE = /reuters|associated press|\bap\b|bbc|nhk|nyt|new york times|ブルームバーグ|bloomberg/i;

export function scoreImpact(article: NewsArticle): ImpactHit | null {
  const text = `${article.title} ${article.originalTitle ?? ""} ${article.summary}`.slice(0, 500);
  let score = 0;
  let kind: ImpactHit["kind"] = "breaking";
  let urgent = false;

  if (article.eventIds?.includes(DISASTER_EVENT_ID) || DISASTER.test(text)) {
    score += 10;
    kind = "disaster";
    urgent = true;
  }
  if (CRISIS.test(text)) {
    score += 9;
    kind = "crisis";
    urgent = true;
  }
  if (SHOCK.test(text)) score += 5;
  if (PROFILE.test(text)) score += 4;
  if (WIRE.test(article.source) || WIRE.test(article.link)) score += 1;
  if (article.publishedMs > 0 && Date.now() - article.publishedMs < 2 * 60 * 60 * 1000) score += 1;

  if (score < 5) return null;
  return { score, urgent, kind };
}

export function tagImpact(articles: NewsArticle[]) {
  for (const article of articles) {
    const hit = scoreImpact(article);
    if (!hit) continue;
    article.impact = hit.score;
    article.urgent = hit.urgent;
  }
}
