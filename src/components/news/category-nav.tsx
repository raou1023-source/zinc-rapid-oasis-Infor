import { CATEGORIES, type DeskTab, type SpecialEvent } from "@/lib/news/types";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";

export function CategoryNav({
  value,
  onChange,
  events,
}: {
  value: DeskTab;
  onChange: (next: DeskTab) => void;
  events: SpecialEvent[];
}) {
  const { t } = useI18n();
  const tabs: { id: DeskTab; label: string; special?: boolean }[] = [
    { id: "all", label: t.all },
    ...(events.length > 0 ? [{ id: "special" as const, label: t.special, special: true }] : []),
    ...CATEGORIES.map((id) => ({ id, label: t.categories[id] })),
  ];

  return (
    <nav aria-label={t.nav} className="sticky top-0 z-20 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="flex gap-0 overflow-x-auto px-2 md:px-6">
        {tabs.map((tab) => {
          const active = tab.id === value;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative min-h-12 shrink-0 px-4 text-sm tracking-[0.08em] transition-colors",
                active ? "font-medium text-ink" : "text-muted hover:text-ink",
                tab.special && !active && "text-vermilion",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "absolute inset-x-3 bottom-0 h-[2px] origin-center transition-transform",
                  tab.special ? "bg-vermilion" : "bg-ink",
                  active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
