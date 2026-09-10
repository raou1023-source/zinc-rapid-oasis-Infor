import { Bookmark } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useBookmarks } from "@/lib/news/bookmarks";
import type { NewsArticle } from "@/lib/news/types";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  article,
  className,
}: {
  article: NewsArticle;
  className?: string;
}) {
  const { t } = useI18n();
  const saved = useBookmarks((s) => s.items.some((a) => a.id === article.id));
  const toggle = useBookmarks((s) => s.toggle);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? t.unbookmark : t.bookmark}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(article);
      }}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md text-muted transition hover:bg-paper-2 hover:text-ink",
        saved && "text-vermilion",
        className,
      )}
    >
      <Bookmark className={cn("size-4", saved && "fill-current")} strokeWidth={1.6} />
    </button>
  );
}
