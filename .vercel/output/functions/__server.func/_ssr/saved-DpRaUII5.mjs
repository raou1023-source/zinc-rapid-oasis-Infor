import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useI18n } from "./use-i18n-B-n2doA0.mjs";
import { c as ArrowLeft } from "../_libs/lucide-react.mjs";
import { c as useBookmarks, n as LanguageSwitcher } from "./format-BRl3F0La.mjs";
import { t as ArticleCard } from "./article-card-EYccTpDO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-DpRaUII5.js
var import_jsx_runtime = require_jsx_runtime();
function SavedPage() {
	const items = useBookmarks((s) => s.items);
	const { lang, t } = useI18n();
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg tracking-tight",
					children: t.savedTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitcher, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl px-4 py-8 md:px-8",
			children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-20 text-center text-sm text-muted",
				children: t.savedEmpty
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: items.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article }, article.id)) })
		})]
	});
}
//#endregion
export { SavedPage as component };
