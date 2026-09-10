import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ArticleCard } from "@/components/news/article-card";
import { LanguageSwitcher } from "@/components/news/language-switcher";
import { validateLangSearch } from "@/lib/i18n/search";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useBookmarks } from "@/lib/news/bookmarks";

export const Route = createFileRoute("/saved")({
  validateSearch: validateLangSearch,
  component: SavedPage,
});

function SavedPage() {
  const items = useBookmarks((s) => s.items);
  const { lang, t } = useI18n();

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
        <p className="font-display text-lg tracking-tight">{t.savedTitle}</p>
        <LanguageSwitcher />
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        {items.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">{t.savedEmpty}</p>
        ) : (
          <section>
            {items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
