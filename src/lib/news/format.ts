import { LOCALE_META, type Locale } from "@/lib/i18n/locales";

export function formatRelative(iso: string | number, locale: Locale = "ja"): string {
  const ms = typeof iso === "number" ? iso : Date.parse(iso);
  if (!Number.isFinite(ms)) return "";
  const intl = LOCALE_META[locale].intl;
  const rtf = new Intl.RelativeTimeFormat(intl, { numeric: "auto" });
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (abs < hour) return rtf.format(Math.round(diff / minute), "minute");
  if (abs < day) return rtf.format(Math.round(diff / hour), "hour");
  if (abs < 7 * day) return rtf.format(Math.round(diff / day), "day");
  return new Intl.DateTimeFormat(intl, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ms);
}

export function formatMastheadDate(locale: Locale = "ja", date = new Date()): string {
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

export function formatClock(locale: Locale = "ja", date = new Date()): string {
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function formatFetched(iso: string, locale: Locale = "ja"): string {
  return new Date(iso).toLocaleString(LOCALE_META[locale].intl);
}
