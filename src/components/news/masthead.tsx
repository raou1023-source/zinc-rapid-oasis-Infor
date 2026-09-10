import { Link } from "@tanstack/react-router";
import { Bookmark, Search } from "lucide-react";
import { AlertBell } from "@/components/news/alert-bell";
import { InstallButton } from "@/components/news/pwa";
import { LanguageSwitcher } from "@/components/news/language-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatClock, formatMastheadDate } from "@/lib/news/format";
import { useBookmarks } from "@/lib/news/bookmarks";

export function Masthead({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const { lang, t, meta } = useI18n();
  const savedCount = useBookmarks((s) => s.items.length);

  return (
    <header className="border-b border-ink">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2 text-[11px] tracking-[0.16em] text-muted md:px-8">
        <p className="truncate" suppressHydrationWarning>
          {formatMastheadDate(lang)}
        </p>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <p className="hidden shrink-0 tabular-nums sm:block" suppressHydrationWarning>
            {formatClock(lang)} JST · {t.city}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-4 px-4 py-5 md:flex-row md:items-end md:justify-between md:px-8 md:py-6">
        <Link to="/" search={{ lang }} className="group min-w-0">
          <p className="mb-1 text-[10px] tracking-[0.42em] text-vermilion">{meta.edition} EDITION</p>
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-[2.6rem] leading-none tracking-[-0.04em] text-ink md:text-[3.4rem]">
              In報
            </h1>
          </div>
          <p className="mt-2 max-w-md text-[12px] leading-5 text-muted">{t.tagline}</p>
        </Link>
        <div className="flex items-center gap-2">
          <label className="relative min-w-0 flex-1 md:w-64 md:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t.search}
              suppressHydrationWarning
              className="h-11 w-full rounded-md border border-rule bg-paper-2 pr-3 pl-9 text-sm text-ink outline-none placeholder:text-faint focus:border-ink"
            />
          </label>
          <AlertBell />
          <InstallButton />
          <Link
            to="/saved"
            search={{ lang }}
            className="relative inline-flex h-11 items-center gap-2 rounded-md border border-rule px-3 text-sm text-ink hover:border-ink"
          >
            <Bookmark className="size-4" strokeWidth={1.6} />
            <span className="hidden sm:inline">{t.saved}</span>
            {savedCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 rounded-full bg-vermilion px-1 text-center text-[10px] leading-4 text-paper tabular-nums">
                {savedCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
