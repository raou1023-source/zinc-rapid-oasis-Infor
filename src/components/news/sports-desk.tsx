import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ArticleCard } from "@/components/news/article-card";
import { useI18n } from "@/lib/i18n/use-i18n";
import { getSportNews } from "@/lib/news/server";
import { findSportsByQuery, rankBySport, SPORTS, type SportDef } from "@/lib/news/sports";
import { rememberArticles } from "@/lib/news/seen";
import type { NewsArticle } from "@/lib/news/types";
import { cn } from "@/lib/utils";

export function SportsDesk({ articles, seedQuery = "" }: { articles: NewsArticle[]; seedQuery?: string }) {
  const { lang, t } = useI18n();
  const [q, setQ] = useState(seedQuery);
  const [picked, setPicked] = useState<string | null>(null);
  const [extra, setExtra] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (seedQuery) {
      setQ(seedQuery);
      setPicked(null);
    }
  }, [seedQuery]);

  const matched = useMemo(() => findSportsByQuery(q), [q]);
  const activeIds = useMemo(() => {
    if (picked) return [picked];
    return matched.map((sport) => sport.id);
  }, [picked, matched]);

  useEffect(() => {
    const sport = activeIds[0];
    if (!sport) {
      setExtra([]);
      return;
    }
    let alive = true;
    const timer = window.setTimeout(() => {
      void getSportNews({ data: { sport, lang } }).then((list) => {
        if (!alive) return;
        rememberArticles(list);
        setExtra(list);
      });
    }, 220);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [activeIds, lang]);

  const merged = useMemo(() => {
    const seen = new Set(articles.map((a) => a.id));
    const rest = extra.filter((a) => !seen.has(a.id));
    return rankBySport([...articles, ...rest], activeIds);
  }, [articles, extra, activeIds]);

  const chips: SportDef[] = SPORTS;

  return (
    <section className="py-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-[10px] tracking-[0.28em] text-vermilion">{t.kickers.sports}</p>
        <label className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value.slice(0, 80));
              setPicked(null);
            }}
            placeholder={t.sportSearch}
            className="h-11 w-full rounded-md border border-rule bg-paper-2 pr-3 pl-9 text-sm text-ink outline-none placeholder:text-faint focus:border-ink"
          />
        </label>
      </div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => {
            setPicked(null);
            setQ("");
          }}
          className={cn(
            "h-9 shrink-0 rounded-full border px-3 text-[12px]",
            !picked && !q ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink",
          )}
        >
          {t.sportAll}
        </button>
        {chips.map((sport) => {
          const on = picked === sport.id || matched.some((item) => item.id === sport.id);
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => {
                setPicked(sport.id);
                setQ(sport.labels[lang]);
              }}
              className={cn(
                "h-9 shrink-0 rounded-full border px-3 text-[12px]",
                on ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink",
              )}
            >
              {sport.labels[lang]}
            </button>
          );
        })}
      </div>
      {activeIds.length > 0 ? (
        <p className="mb-4 text-[12px] text-muted">
          {t.sportPriority}: {activeIds.map((id) => SPORTS.find((s) => s.id === id)?.labels[lang]).filter(Boolean).join(" / ")}
        </p>
      ) : null}
      {merged.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">{t.empty}</p>
      ) : (
        <div className="grid gap-x-10 md:grid-cols-2">
          {merged.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
