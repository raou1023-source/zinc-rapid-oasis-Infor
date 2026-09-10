import { i as __toESM } from "../_runtime.mjs";
import { s as safeHttpUrl } from "./safe-DkHGBtm8.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useI18n } from "./use-i18n-B-n2doA0.mjs";
import { c as ArrowLeft, s as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-qeoWsEao.mjs";
import { c as useBookmarks, n as LanguageSwitcher, s as formatRelative, t as BookmarkButton } from "./format-BRl3F0La.mjs";
import { t as recallArticle } from "./seen-B0GYTYYm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/article._id-BneqWlUO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ArticlePage() {
	const { article, news } = Route.useLoaderData();
	const { id } = Route.useParams();
	const { lang, t } = useI18n();
	const [local, setLocal] = (0, import_react.useState)(null);
	const saved = useBookmarks((s) => s.items.find((item) => item.id === id) ?? null);
	(0, import_react.useEffect)(() => {
		if (article) return;
		setLocal(recallArticle(id) ?? saved);
	}, [
		article,
		id,
		saved
	]);
	const shown = article ?? local ?? saved;
	const related = shown ? news.articles.filter((a) => a.category === shown.category && a.id !== shown.id).slice(0, 5) : [];
	const originalHref = shown ? safeHttpUrl(shown.link) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between border-b border-ink px-4 py-3 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					search: { lang },
					className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), t.back]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					search: { lang },
					className: "font-display text-lg tracking-tight",
					children: "In報"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitcher, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 py-10 md:px-0",
			children: [!shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-16 text-center text-sm text-muted",
				children: t.missing
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] tracking-[0.2em] text-vermilion",
					children: [
						t.categories[shown.category],
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-faint",
							children: "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: shown.source
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-[1.85rem] leading-[1.3] tracking-[-0.03em] md:text-[2.35rem]",
						children: shown.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkButton, { article: shown })]
				}),
				shown.originalTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm leading-6 text-muted",
					children: [
						t.original,
						": ",
						shown.originalTitle
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
					dateTime: shown.publishedAt,
					className: "mt-3 block text-[12px] tabular-nums text-faint",
					children: formatRelative(shown.publishedMs, lang)
				}),
				shown.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-[1.02rem] leading-8 text-ink/90",
					children: shown.summary
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-[0.95rem] leading-7 text-muted",
					children: t.headlineOnly
				}),
				originalHref ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: originalHref,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 text-sm text-paper hover:bg-ink/90",
					children: [t.readOriginal, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
				}) : null
			] }), related.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 border-t border-rule pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 font-display text-lg",
					children: t.related
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-4",
					children: related.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/article/$id",
						params: { id: item.id },
						search: { lang },
						className: "block hover:text-vermilion",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[1.05rem] leading-snug",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-faint",
							children: [
								item.source,
								" · ",
								formatRelative(item.publishedMs, lang)
							]
						})]
					}) }, item.id))
				})]
			}) : null]
		})]
	});
}
//#endregion
export { ArticlePage as component };
