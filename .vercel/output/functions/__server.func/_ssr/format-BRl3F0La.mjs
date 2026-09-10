import { n as LOCALE_META, o as parseLocale, t as LOCALES } from "./safe-DkHGBtm8.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as useRouterState, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useI18n } from "./use-i18n-B-n2doA0.mjs";
import { a as Bookmark } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-BRl3F0La.js
var import_jsx_runtime = require_jsx_runtime();
var useBookmarks = create()(persist((set, get) => ({
	items: [],
	has: (id) => get().items.some((a) => a.id === id),
	toggle: (article) => set((state) => {
		return { items: state.items.some((a) => a.id === article.id) ? state.items.filter((a) => a.id !== article.id) : [article, ...state.items].slice(0, 80) };
	})
}), { name: "shinpo-bookmarks" }));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function BookmarkButton({ article, className }) {
	const { t } = useI18n();
	const saved = useBookmarks((s) => s.items.some((a) => a.id === article.id));
	const toggle = useBookmarks((s) => s.toggle);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": saved,
		"aria-label": saved ? t.unbookmark : t.bookmark,
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			toggle(article);
		},
		className: cn("inline-flex size-11 items-center justify-center rounded-md text-muted transition hover:bg-paper-2 hover:text-ink", saved && "text-vermilion", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
			className: cn("size-4", saved && "fill-current"),
			strokeWidth: 1.6
		})
	});
}
function LanguageSwitcher() {
	const lang = useRouterState({ select: (s) => parseLocale(s.location.search.lang) });
	const navigate = useNavigate();
	function setLang(next) {
		navigate({
			to: ".",
			search: (prev) => ({
				...prev,
				lang: next
			})
		});
		try {
			localStorage.setItem("shinpo-lang", next);
		} catch {}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "group",
		"aria-label": LOCALE_META[lang].native,
		className: "flex items-center gap-1",
		children: LOCALES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setLang(code),
			"aria-pressed": code === lang,
			className: cn("h-8 min-w-8 rounded-md px-2 text-[11px] tracking-wide", code === lang ? "bg-ink text-paper" : "text-muted hover:text-ink"),
			children: code === "zh" ? "中" : code === "ja" ? "日" : code === "ko" ? "한" : "EN"
		}, code))
	});
}
function formatRelative(iso, locale = "ja") {
	const ms = typeof iso === "number" ? iso : Date.parse(iso);
	if (!Number.isFinite(ms)) return "";
	const intl = LOCALE_META[locale].intl;
	const rtf = new Intl.RelativeTimeFormat(intl, { numeric: "auto" });
	const diff = ms - Date.now();
	const abs = Math.abs(diff);
	const minute = 6e4;
	const hour = 60 * minute;
	const day = 24 * hour;
	if (abs < hour) return rtf.format(Math.round(diff / minute), "minute");
	if (abs < day) return rtf.format(Math.round(diff / hour), "hour");
	if (abs < 7 * day) return rtf.format(Math.round(diff / day), "day");
	return new Intl.DateTimeFormat(intl, {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	}).format(ms);
}
function formatMastheadDate(locale = "ja", date = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "long"
	}).format(date);
}
function formatClock(locale = "ja", date = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).format(date);
}
function formatFetched(iso, locale = "ja") {
	return new Date(iso).toLocaleString(LOCALE_META[locale].intl);
}
//#endregion
export { formatFetched as a, useBookmarks as c, formatClock as i, LanguageSwitcher as n, formatMastheadDate as o, cn as r, formatRelative as s, BookmarkButton as t };
