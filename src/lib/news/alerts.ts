import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/lib/i18n/locales";
import { DISASTER_EVENT_ID } from "./events";
import { scoreImpact } from "./impact";
import type { NewsArticle, SpecialEvent } from "./types";

export type AlertItem = {
  id: string;
  eventId: string;
  eventLabel: string;
  title: string;
  at: number;
  read: boolean;
  urgent?: boolean;
};

type AlertState = {
  enabled: boolean;
  seenIds: string[];
  items: AlertItem[];
  toasts: AlertItem[];
  setEnabled: (value: boolean) => void;
  ingest: (events: SpecialEvent[], articles: NewsArticle[], lang: Locale) => AlertItem[];
  markAllRead: () => void;
  dismissToast: (id: string) => void;
};

const MAX_ITEMS = 40;
const IMPACT_LABEL: Record<Locale, Record<"disaster" | "crisis" | "breaking", string>> = {
  ja: { disaster: "地震・災害", crisis: "重大", breaking: "速報" },
  en: { disaster: "Disaster", crisis: "Major", breaking: "Breaking" },
  zh: { disaster: "灾害", crisis: "重大", breaking: "快讯" },
  ko: { disaster: "재해", crisis: "중대", breaking: "속보" },
};

function isTopFrame() {
  if (typeof window === "undefined") return false;
  return window.self === window.top;
}

export const useAlerts = create<AlertState>()(
  persist(
    (set, get) => ({
      enabled: true,
      seenIds: [],
      items: [],
      toasts: [],
      setEnabled: (enabled) => set({ enabled }),
      ingest: (events, articles, lang) => {
        const seen = new Set(get().seenIds);
        const fresh: AlertItem[] = [];
        const now = Date.now();
        const labels = IMPACT_LABEL[lang];

        for (const article of articles) {
          if (seen.has(article.id)) continue;
          const impact = scoreImpact(article);
          const isDisaster = article.eventIds?.includes(DISASTER_EVENT_ID) || impact?.kind === "disaster";
          const desk = events.find((event) => article.eventIds?.includes(event.id));
          const high = Boolean(impact && impact.score >= 5);
          const age = article.publishedMs > 0 ? now - article.publishedMs : 0;
          const tooOld = age > (isDisaster ? 8 * 60 * 60 * 1000 : 6 * 60 * 60 * 1000);
          if (tooOld) {
            seen.add(article.id);
            continue;
          }
          if (!isDisaster && !high && !desk) continue;
          seen.add(article.id);
          const kind = isDisaster ? "disaster" : impact?.kind === "crisis" ? "crisis" : "breaking";
          fresh.push({
            id: article.id,
            eventId: isDisaster ? DISASTER_EVENT_ID : high ? `impact-${kind}` : desk!.id,
            eventLabel: isDisaster ? labels.disaster : high ? labels[kind] : desk!.label[lang],
            title: article.title,
            at: article.publishedMs || now,
            read: false,
            urgent: Boolean(isDisaster || impact?.urgent),
          });
        }

        if (fresh.length === 0 && get().items.length === 0) {
          const seed = articles
            .filter((article) => !seen.has(article.id))
            .slice(0, 2)
            .map((article) => {
              seen.add(article.id);
              return {
                id: article.id,
                eventId: "impact-breaking",
                eventLabel: labels.breaking,
                title: article.title,
                at: article.publishedMs || now,
                read: false,
                urgent: false,
              } satisfies AlertItem;
            });
          if (seed.length > 0) fresh.push(...seed);
        }

        if (fresh.length === 0) {
          set({ seenIds: [...seen].slice(-400) });
          return [];
        }
        fresh.sort((a, b) => Number(b.urgent) - Number(a.urgent) || b.at - a.at);
        const capped = fresh.slice(0, 4);
        set({
          seenIds: [...seen].slice(-400),
          items: [...capped, ...get().items].slice(0, MAX_ITEMS),
          toasts: [...capped, ...get().toasts].slice(0, 4),
        });
        return capped;
      },
      markAllRead: () => set({ items: get().items.map((item) => ({ ...item, read: true })) }),
      dismissToast: (id) => set({ toasts: get().toasts.filter((item) => item.id !== id) }),
    }),
    {
      name: "inho-alerts-v2",
      partialize: (state) => ({
        enabled: state.enabled,
        seenIds: state.seenIds,
        items: state.items,
      }),
    },
  ),
);

export async function enableBrowserNotifications(): Promise<boolean> {
  if (typeof Notification === "undefined") {
    useAlerts.getState().setEnabled(true);
    return false;
  }
  if (!isTopFrame()) {
    useAlerts.getState().setEnabled(true);
    return false;
  }
  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  const ok = permission === "granted";
  useAlerts.getState().setEnabled(true);
  return ok;
}

export async function pushBrowserNotifications(items: AlertItem[]) {
  if (typeof window === "undefined" || items.length === 0) return;
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const ordered = [...items].sort((a, b) => Number(b.urgent) - Number(a.urgent)).slice(0, 4);
  let shown = false;
  try {
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.ready : null;
    if (reg?.showNotification) {
      for (const item of ordered) {
        await reg.showNotification(item.eventLabel.slice(0, 60), {
          body: item.title.slice(0, 140),
          tag: item.urgent ? `urgent-${item.id}` : item.id,
          requireInteraction: Boolean(item.urgent),
          data: { url: `/article/${item.id}` },
        });
      }
      shown = true;
    }
  } catch {
    shown = false;
  }
  if (shown) return;
  for (const item of ordered) {
    try {
      new Notification(item.eventLabel.slice(0, 60), {
        body: item.title.slice(0, 140),
        tag: item.urgent ? `urgent-${item.id}` : item.id,
        requireInteraction: Boolean(item.urgent),
      });
    } catch {
      /* ignore */
    }
  }
}

export async function notifyFresh(items: AlertItem[]): Promise<void> {
  if (items.length === 0) return;
  useAlerts.getState().setEnabled(true);
  await pushBrowserNotifications(items);
}
