import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BookmarkButton } from "@/components/news/bookmark-button";
import { LanguageSwitcher } from "@/components/news/language-switcher";
import { validateLangSearch } from "@/lib/i18n/search";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatRelative } from "@/lib/news/format";
import { getArticle, getNews } from "@/lib/news/server";
import { recallArticle } from "@/lib/news/seen";
import { safeHttpUrl } from "@/lib/news/safe";
import { useBookmarks } from "@/lib/news/bookmarks";
import type { NewsArticle } from "@/lib/news/types";

export const Route = createFileRoute("/article/$id")({
  validateSearch: validateLangSearch,
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  staleTime: 60_000,
  loader: async ({ deps, params }) => {
    const [article, news] = await Promise.all([
      getArticle({ data: { id: params.id, lang: deps.lang } }),
      getNews({ data: { lang: deps.lang } }),
    ]);
    return { article, news };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article, news } = Route.useLoaderData();
  const { id } = Route.useParams();
  const { lang, t } = useI18n();
  const [local, setLocal] = useState<NewsArticle | null>(null);
  const saved = useBookmarks((s) => s.items.find((item) => item.id === id) ?? null);

  useEffect(() => {
    if (article) return;
    setLocal(recallArticle(id) ?? saved);
  }, [article, id, saved]);

  const shown = article ?? local ?? saved;
  const related = shown
    ? news.articles.filter((a) => a.category === shown.category && a.id !== shown.id).slice(0, 5)
    : [];
  const originalHref = shown ? safeHttpUrl(shown.link) : null;

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="flex items-center justify-between border-b border-ink px-4 py-3 md:px-8">
        <Link
          to="/"
          search={{ lang }}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          {t.back}
        </Link>
        <Link to="/" search={{ lang }} className="font-display text-lg tracking-tight">
          In報
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 md:px-0">
        {!shown ? (
          <p className="py-16 text-center text-sm text-muted">{t.missing}</p>
        ) : (
          <>
            <p className="text-[11px] tracking-[0.2em] text-vermilion">
              {t.categories[shown.category]}
              <span className="mx-2 text-faint">/</span>
              <span className="text-muted">{shown.source}</span>
            </p>
            <div className="mt-3 flex items-start justify-between gap-3">
              <h1 className="font-display text-[1.85rem] leading-[1.3] tracking-[-0.03em] md:text-[2.35rem]">
                {shown.title}
              </h1>
              <BookmarkButton article={shown} />
            </div>
            {shown.originalTitle ? (
              <p className="mt-2 text-sm leading-6 text-muted">
                {t.original}: {shown.originalTitle}
              </p>
            ) : null}
            <time dateTime={shown.publishedAt} className="mt-3 block text-[12px] tabular-nums text-faint">
              {formatRelative(shown.publishedMs, lang)}
            </time>
            {shown.summary ? (
              <p className="mt-8 text-[1.02rem] leading-8 text-ink/90">{shown.summary}</p>
            ) : (
              <p className="mt-8 text-[0.95rem] leading-7 text-muted">{t.headlineOnly}</p>
            )}
            {originalHref ? (
            <a
              href={originalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 text-sm text-paper hover:bg-ink/90"
            >
              {t.readOriginal}
              <ArrowUpRight className="size-4" />
            </a>
            ) : null}
          </>
        )}

        {related.length > 0 ? (
          <section className="mt-16 border-t border-rule pt-8">
            <h2 className="mb-4 font-display text-lg">{t.related}</h2>
            <ul className="space-y-4">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    to="/article/$id"
                    params={{ id: item.id }}
                    search={{ lang }}
                    className="block hover:text-vermilion"
                  >
                    <p className="font-display text-[1.05rem] leading-snug">{item.title}</p>
                    <p className="mt-1 text-[11px] text-faint">
                      {item.source} · {formatRelative(item.publishedMs, lang)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}
