import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "@/components/news/bookmark-button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatRelative } from "@/lib/news/format";
import { DISASTER_EVENT_ID } from "@/lib/news/events";
import type { NewsArticle } from "@/lib/news/types";
import { cn } from "@/lib/utils";

export const ArticleCard = memo(function ArticleCard({
  article,
  featured = false,
  compact = false,
}: {
  article: NewsArticle;
  featured?: boolean;
  compact?: boolean;
}) {
  const { lang, t } = useI18n();

  if (compact) {
    return (
      <article className="group [content-visibility:auto] [contain-intrinsic-size:4.5rem]">
        <Link
          to="/article/$id"
          params={{ id: article.id }}
          search={{ lang }}
          preload={false}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          <h2 className="font-display text-[0.98rem] leading-snug text-ink transition-colors group-hover:text-vermilion">
            {article.title}
          </h2>
          <p className="mt-1 text-[11px] tabular-nums text-faint" suppressHydrationWarning>
            {article.source}
            {article.translated ? ` · ${t.translated}` : ""} · {formatRelative(article.publishedMs, lang)}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col border-b border-rule",
        featured ? "gap-4 py-6 md:py-8" : "gap-2 py-5",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.18em]">
          <span className="font-medium text-vermilion">
            {article.eventIds?.includes(DISASTER_EVENT_ID)
              ? t.disaster
              : article.urgent || (article.impact ?? 0) >= 7
                ? t.breaking
                : t.categories[article.category]}
          </span>
          <span className="text-faint">/</span>
          <span className="text-muted">{article.source}</span>
          {article.translated ? (
            <>
              <span className="text-faint">/</span>
              <span className="text-vermilion">{t.translated}</span>
            </>
          ) : null}
        </div>
        <BookmarkButton article={article} className="-mr-2 size-9" />
      </div>
      <Link
        to="/article/$id"
        params={{ id: article.id }}
        search={{ lang }}
        preload={featured ? "intent" : false}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
      >
        <h2
          className={cn(
            "font-display text-balance text-ink transition-colors group-hover:text-vermilion",
            featured
              ? "text-[1.65rem] leading-[1.25] tracking-[-0.03em] md:text-[2.15rem]"
              : "text-[1.05rem] leading-snug tracking-[-0.02em] md:text-[1.15rem]",
          )}
        >
          {article.title}
        </h2>
        {article.originalTitle ? (
          <p className="mt-1 text-[12px] leading-5 text-faint">{article.originalTitle}</p>
        ) : null}
        {article.summary ? (
          <p
            className={cn(
              "mt-2 max-w-prose text-pretty text-muted",
              featured ? "text-[0.95rem] leading-7 line-clamp-3" : "text-[0.82rem] leading-6 line-clamp-2",
            )}
          >
            {article.summary}
          </p>
        ) : null}
      </Link>
      <time dateTime={article.publishedAt} className="text-[11px] tabular-nums text-faint" suppressHydrationWarning>
        {formatRelative(article.publishedMs, lang)}
      </time>
    </article>
  );
});
