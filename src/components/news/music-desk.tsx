import { ArticleCard } from "@/components/news/article-card";
import { useI18n } from "@/lib/i18n/use-i18n";
import { byFreshness } from "@/lib/news/fresh";
import type { Category, NewsArticle } from "@/lib/news/types";

export function RegionDesk({ articles, category }: { articles: NewsArticle[]; category: Category }) {
  const { t } = useI18n();
  const domestic = byFreshness(articles.filter((a) => a.region !== "overseas"));
  const overseas = byFreshness(articles.filter((a) => a.region === "overseas"));

  if (domestic.length === 0 && overseas.length === 0) {
    return <p className="py-16 text-center text-sm text-muted">{t.empty}</p>;
  }

  const columns = [
    { key: "overseas", title: t.musicOverseas, kicker: "WORLD", list: overseas },
    { key: "domestic", title: t.musicDomestic, kicker: "JAPAN", list: domestic },
  ].filter((col) => col.list.length > 0);

  return (
    <section className="py-6">
      <p className="mb-4 text-[10px] tracking-[0.28em] text-vermilion">{t.kickers[category]}</p>
      <div className={`grid gap-10 ${columns.length > 1 ? "md:grid-cols-2" : ""}`}>
        {columns.map((col) => (
          <div key={col.key}>
            <div className="mb-3 flex items-baseline justify-between border-b border-ink pb-2">
              <h2 className="font-display text-xl tracking-tight">{col.title}</h2>
              <span className="text-[10px] tracking-[0.2em] text-muted">{col.kicker}</span>
            </div>
            <div className="divide-y divide-rule">
              {col.list.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MusicDesk({ articles }: { articles: NewsArticle[] }) {
  return <RegionDesk articles={articles} category="music" />;
}

export function PoliticsDesk({ articles }: { articles: NewsArticle[] }) {
  return <RegionDesk articles={articles} category="politics" />;
}
