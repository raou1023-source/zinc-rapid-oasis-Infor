import { useRouterState } from "@tanstack/react-router";
import { LOCALE_META, MESSAGES, parseLocale, type Locale } from "./locales";

export function useI18n() {
  const lang = useRouterState({
    select: (s) => parseLocale((s.location.search as { lang?: unknown }).lang),
  }) as Locale;
  return { lang, t: MESSAGES[lang], meta: LOCALE_META[lang] };
}
