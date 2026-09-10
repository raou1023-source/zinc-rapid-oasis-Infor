import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArticleCard } from "@/components/news/article-card";
import { CategoryNav } from "@/components/news/category-nav";
import { Masthead } from "@/components/news/masthead";
import { Ticker } from "@/components/news/ticker";
import { PwaBanner } from "@/components/news/pwa";
import { AlertToasts } from "@/components/news/alert-toasts";
import { SportsDesk } from "@/components/news/sports-desk";
import { MusicDesk, PoliticsDesk } from "@/components/news/music-desk";
import { validateLangSearch } from "@/lib/i18n/search";
import { useI18n } from "@/lib/i18n/use-i18n";
import { notifyFresh, useAlerts } from "@/lib/news/alerts";
import { latestUpdates, byFreshness } from "@/lib/news/fresh";
import { formatFetched } from "@/lib/news/format";
import { rememberArticles } from "@/lib/news/seen";
import { getNews } from "@/lib/news/server";
import { CATEGORIES, type DeskTab, type NewsPayload } from "@/lib/news/types";

export const Route = createFileRoute("/")({
  validateSearch: validateLangSearch,
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  staleTime: 120_000,
  pendingMs: 200,
  loader: ({ deps: { lang } }) => getNews({ data: { lang } }),
  pendingComponent: HomePending,
  component: Home,
});

function HomePending() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <div className="h-28 border-b border-ink" />
      <div className="h-14 bg-ink" />
      <div className="h-12 border-b border-rule" />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-6 h-8 w-40 bg-rule/80" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 border-b border-rule" />
          ))}
        </div>
      </main>
    </div>
  );
}

function Home() {
  const loaded = Route.useLoaderData();
  const { lang, t } = useI18n();
  const [news, setNews] = useState<NewsPayload>(loaded);
  const [tab, setTab] = useState<DeskTab>("all");
  const [query, setQuery] = useState("");
  const ingest = useAlerts((s) => s.ingest);
  const retries = useRef(0);
  const langRef = useRef(lang);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (langRef.current !== lang) {
      langRef.current = lang;
      retries.current = 0;
      setNews(loaded);
    }
  }, [lang, loaded]);

  useEffect(() => {
    let alive = true;
    const apply = (next: NewsPayload) => {
      if (!alive || next.articles.length === 0) return;
      const y = window.scrollY;
      setNews(next);
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: "instant" });
      });
    };
    if (loaded.articles.length === 0 && retries.current < 1) {
      retries.current += 1;
      window.setTimeout(() => {
        void getNews({ data: { lang } }).then(apply);
      }, 1400);
    }
    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void getNews({ data: { lang } }).then(apply);
    }, 45_000);
    return () => {
      alive = false;
      window.clearInterval(tick);
    };
  }, [lang, loaded.articles.length]);

  const articles = useMemo(() => byFreshness(news.articles), [news.articles]);
  const events = news.events ?? [];
  const latest = useMemo(() => latestUpdates(articles, 10), [articles]);

  useEffect(() => {
    rememberArticles(articles);
  }, [articles]);

  useEffect(() => {
    if (!hydrated || articles.length === 0) return;
    const fresh = ingest(events, articles, lang);
    if (fresh.length > 0) void notifyFresh(fresh);
  }, [hydrated, articles, events, ingest, lang]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return articles.filter((a) => {
      if (tab === "special") {
        if (!a.eventIds?.length) return false;
      } else if (tab !== "all" && a.category !== tab) {
        return false;
      }
      if (!q) return true;
      return a.title.includes(q) || a.source.includes(q) || a.summary.includes(q);
    });
  }, [articles, tab, query]);

  const featured = tab === "all" && !query ? latest[0] : undefined;
  const rest = featured ? filtered.filter((a) => a.id !== featured.id) : filtered;
  const liveEvents = events.filter((event) => event.count > 0);
  const categoryDesks = CATEGORIES.map((cat) => ({
    cat,
    list: byFreshness(articles.filter((a) => a.category === cat)).slice(0, 8),
  })).filter((desk) => desk.list.length > 0);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <Masthead query={query} onQueryChange={setQuery} />
      <Ticker articles={articles} />
      <AlertToasts />
      <CategoryNav value={tab} onChange={setTab} events={liveEvents} />

      <main className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        {tab === "special" && liveEvents.length > 0 ? (
          <section className="border-b border-ink py-6">
            <p className="text-[10px] tracking-[0.28em] text-vermilion">{t.special}</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight md:text-3xl">{t.special}</h2>
            <p className="mt-2 text-sm text-muted">
              {liveEvents.map((event) => event.label[lang]).join(" / ")}
            </p>
          </section>
        ) : null}

        {featured ? (
          <section className="border-b border-ink">
            <p className="pt-5 text-[10px] tracking-[0.28em] text-vermilion">{t.topStory}</p>
            <ArticleCard article={featured} featured />
          </section>
        ) : null}

        {tab === "all" && !query && latest.length > 1 ? (
          <section className="border-b border-rule py-6">
            <p className="mb-3 text-[10px] tracking-[0.28em] text-vermilion">{t.latest}</p>
            <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2">
              {latest.slice(1, 9).map((article) => (
                <li key={article.id}>
                  <ArticleCard article={article} compact />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === "all" && !query && liveEvents.length > 0 ? (
          <section className="border-b border-rule py-6">
            <button type="button" onClick={() => setTab("special")} className="mb-4 text-left">
              <p className="text-[10px] tracking-[0.28em] text-vermilion">{t.special}</p>
            </button>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {liveEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setTab("special")}
                  className="border border-rule px-4 py-3 text-left hover:border-ink"
                >
                  <p className="text-[10px] tracking-[0.16em] text-vermilion">{t.categories[event.category]}</p>
                  <p className="mt-1 font-display text-lg tracking-tight">{event.label[lang]}</p>
                  <p className="mt-1 text-[12px] leading-5 text-muted">{event.blurb[lang]}</p>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {tab === "special" && !query ? (
          <div className="space-y-10 py-8">
            {CATEGORIES.map((cat) => {
              const desks = liveEvents
                .filter((event) => event.category === cat)
                .map((event) => ({
                  event,
                  list: articles.filter((a) => a.eventIds?.includes(event.id)).slice(0, 5),
                }))
                .filter((desk) => desk.list.length > 0);
              if (desks.length === 0) return null;
              return (
                <section key={cat}>
                  <h3 className="mb-4 border-b border-ink pb-2 font-display text-xl tracking-tight">
                    {t.categories[cat]}
                  </h3>
                  <div className="grid gap-8 md:grid-cols-2">
                    {desks.map(({ event, list }) => (
                      <div key={event.id}>
                        <p className="text-[10px] tracking-[0.18em] text-vermilion">{event.kicker}</p>
                        <p className="mt-1 font-display text-lg">{event.label[lang]}</p>
                        <p className="mt-1 mb-3 text-[12px] text-muted">{event.blurb[lang]}</p>
                        <ul className="divide-y divide-rule">
                          {list.map((article) => (
                            <li key={article.id} className="py-3 first:pt-0">
                              <ArticleCard article={article} compact />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : null}

        {filtered.length === 0 && tab !== "special" && tab !== "sports" && tab !== "music" && tab !== "politics" ? (
          <p className="py-16 text-center text-sm text-muted">{t.empty}</p>
        ) : null}

        {tab === "sports" ? (
          <SportsDesk articles={articles.filter((a) => a.category === "sports")} seedQuery={query} />
        ) : tab === "music" ? (
          <MusicDesk articles={articles.filter((a) => a.category === "music")} />
        ) : tab === "politics" ? (
          <PoliticsDesk articles={articles.filter((a) => a.category === "politics")} />
        ) : tab !== "special" && tab === "all" && !query && categoryDesks.length > 0 ? (
          <section
            className={`grid gap-8 border-b border-rule py-8 sm:grid-cols-2 ${
              categoryDesks.length >= 6
                ? "lg:grid-cols-3 xl:grid-cols-6"
                : categoryDesks.length >= 5
                  ? "lg:grid-cols-5"
                  : categoryDesks.length >= 3
                    ? "lg:grid-cols-3"
                    : ""
            }`}
          >
            {categoryDesks.map(({ cat, list }) => (
              <div key={cat}>
                <button
                  type="button"
                  onClick={() => setTab(cat)}
                  className="mb-3 flex w-full items-baseline justify-between border-b border-ink pb-2 text-left"
                >
                  <span className="font-display text-xl tracking-tight">{t.categories[cat]}</span>
                  <span className="text-[10px] tracking-[0.2em] text-muted">{t.kickers[cat]}</span>
                </button>
                <ul className="divide-y divide-rule">
                  {list.map((article) => (
                    <li key={article.id} className="py-3 first:pt-0">
                      <ArticleCard article={article} compact />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ) : tab !== "special" && rest.length > 0 ? (
          <section className="grid gap-x-10 md:grid-cols-2">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </section>
        ) : null}

        <footer className="mt-12 border-t border-rule pt-6 text-[11px] leading-5 text-faint">
          {t.footer}
          {news.fetchedAt ? ` ${t.fetched} ${formatFetched(news.fetchedAt, lang)}` : null}
        </footer>
      </main>
      <PwaBanner />
    </div>
  );
}
