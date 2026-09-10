import { parseLocale, type Locale } from "./locales";

export type LangSearch = { lang?: Locale };

export function validateLangSearch(search: Record<string, unknown>): LangSearch {
  if (typeof search.lang !== "string" || search.lang.trim() === "") return {};
  return { lang: parseLocale(search.lang) };
}
