import { useNavigate, useRouterState } from "@tanstack/react-router";
import { LOCALES, LOCALE_META, parseLocale, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const lang = useRouterState({
    select: (s) => parseLocale((s.location.search as { lang?: unknown }).lang),
  });
  const navigate = useNavigate();

  function setLang(next: Locale) {
    void navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => ({ ...prev, lang: next }),
    });
    try {
      localStorage.setItem("shinpo-lang", next);
    } catch {
      /* ignore */
    }
  }

  return (
    <div role="group" aria-label={LOCALE_META[lang].native} className="flex items-center gap-1">
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={code === lang}
          className={cn(
            "h-8 min-w-8 rounded-md px-2 text-[11px] tracking-wide",
            code === lang ? "bg-ink text-paper" : "text-muted hover:text-ink",
          )}
        >
          {code === "zh" ? "中" : code === "ja" ? "日" : code === "ko" ? "한" : "EN"}
        </button>
      ))}
    </div>
  );
}
