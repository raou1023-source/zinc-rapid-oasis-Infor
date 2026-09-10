import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useI18n } from "./use-i18n-B-n2doA0.mjs";
import { r as cn, s as formatRelative, t as BookmarkButton } from "./format-BRl3F0La.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/article-card-EYccTpDO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ArticleCard = (0, import_react.memo)(function ArticleCard({ article, featured = false, compact = false }) {
	const { lang, t } = useI18n();
	if (compact) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "group [content-visibility:auto] [contain-intrinsic-size:4.5rem]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/article/$id",
			params: { id: article.id },
			search: { lang },
			preload: false,
			className: "block outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-[0.98rem] leading-snug text-ink transition-colors group-hover:text-vermilion",
				children: article.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-[11px] tabular-nums text-faint",
				suppressHydrationWarning: true,
				children: [
					article.source,
					article.translated ? ` · ${t.translated}` : "",
					" · ",
					formatRelative(article.publishedMs, lang)
				]
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("group relative flex flex-col border-b border-rule", featured ? "gap-4 py-6 md:py-8" : "gap-2 py-5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[11px] tracking-[0.18em]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-vermilion",
							children: article.eventIds?.includes("disaster-alert") ? t.disaster : article.urgent || (article.impact ?? 0) >= 7 ? t.breaking : t.categories[article.category]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-faint",
							children: "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: article.source
						}),
						article.translated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-faint",
							children: "/"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-vermilion",
							children: t.translated
						})] }) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkButton, {
					article,
					className: "-mr-2 size-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/article/$id",
				params: { id: article.id },
				search: { lang },
				preload: featured ? "intent" : false,
				className: "block outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cn("font-display text-balance text-ink transition-colors group-hover:text-vermilion", featured ? "text-[1.65rem] leading-[1.25] tracking-[-0.03em] md:text-[2.15rem]" : "text-[1.05rem] leading-snug tracking-[-0.02em] md:text-[1.15rem]"),
						children: article.title
					}),
					article.originalTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[12px] leading-5 text-faint",
						children: article.originalTitle
					}) : null,
					article.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("mt-2 max-w-prose text-pretty text-muted", featured ? "text-[0.95rem] leading-7 line-clamp-3" : "text-[0.82rem] leading-6 line-clamp-2"),
						children: article.summary
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
				dateTime: article.publishedAt,
				className: "text-[11px] tabular-nums text-faint",
				suppressHydrationWarning: true,
				children: formatRelative(article.publishedMs, lang)
			})
		]
	});
});
//#endregion
export { ArticleCard as t };
