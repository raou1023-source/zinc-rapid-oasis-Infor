import { Link } from "@tanstack/react-router";
import type { NewsArticle } from "@/lib/news/types";
import { DISASTER_EVENT_ID } from "@/lib/news/events";
import { latestUpdates } from "@/lib/news/fresh";
import { useI18n } from "@/lib/i18n/use-i18n";

export function Ticker({ articles }: { articles: NewsArticle[] }) {
  const { lang, t } = useI18n();
  const line = [
    ...latestUpdates(articles, 16).filter((a) => a.eventIds?.includes(DISASTER_EVENT_ID) || a.urgent),
    ...latestUpdates(articles, 16).filter((a) => a.impact && !a.urgent && !a.eventIds?.includes(DISASTER_EVENT_ID)),
    ...latestUpdates(articles, 16).filter((a) => !a.impact && !a.urgent && !a.eventIds?.includes(DISASTER_EVENT_ID)),
  ].slice(0, 16);
  if (line.length === 0) return null;
  const doubled = [...line, ...line];

  return (
    <div className="ticker-wrap flex overflow-hidden border-b border-ink bg-ink text-paper">
      <p className="flex shrink-0 items-center border-r border-paper/20 px-4 py-3.5 text-[12px] font-medium tracking-[0.22em]">
        {t.breaking}
      </p>
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker-track flex w-max gap-12 py-3.5 pr-12">
          {doubled.map((article, i) => (
            <Link
              key={`${article.id}-${i}`}
              to="/article/$id"
              params={{ id: article.id }}
              search={{ lang }}
              preload={false}
              className="flex items-center gap-3.5 text-[15px] leading-snug text-paper hover:text-vermilion-soft md:text-[16px]"
            >
              <span className="text-[12px] tracking-[0.14em] text-vermilion-soft">{t.categories[article.category]}</span>
              <span className="whitespace-nowrap">{article.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
