import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useI18n } from "./use-i18n-B-n2doA0.mjs";
import { c as getDeferredPrompt, d as isStandalone, f as promptInstall, l as isInIframe, p as subscribeInstallPrompt, u as isIosDevice } from "./router-qeoWsEao.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/install-yiRSAJZJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InstallPage() {
	const { lang, t } = useI18n();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [installed, setInstalled] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setInstalled(isStandalone());
		setReady(Boolean(getDeferredPrompt()));
		return subscribeInstallPrompt(() => {
			setReady(Boolean(getDeferredPrompt()));
			if (isStandalone()) setInstalled(true);
		});
	}, []);
	const ios = isIosDevice();
	const framed = isInIframe();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-ink px-4 py-4 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					search: { lang },
					className: "text-[12px] tracking-[0.16em] text-muted",
					children: t.back
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl tracking-tight md:text-4xl",
					children: t.pwaTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-lg text-sm leading-6 text-muted",
					children: t.pwaBanner
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-xl px-4 py-10 md:px-0",
			children: installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border border-ink px-4 py-6 text-sm",
				children: t.pwaAdded
			}) : framed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-6 text-muted",
					children: t.pwaOpenTab
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/install",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex min-h-12 items-center rounded-md bg-ink px-5 text-sm text-paper",
					children: t.install
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => {
						setBusy(true);
						promptInstall().then((result) => {
							setBusy(false);
							if (result === "accepted") setInstalled(true);
						});
					},
					className: "inline-flex min-h-12 items-center rounded-md bg-ink px-5 text-sm text-paper disabled:opacity-60",
					children: t.pwaReady
				}) : null, ios ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "list-decimal space-y-3 pl-5 text-sm leading-6 text-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t.pwaIos1 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t.pwaIos2 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t.pwaIos3 })
					]
				}) : !ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-6 text-muted",
					children: t.pwaChrome
				}) : null]
			})
		})]
	});
}
//#endregion
export { InstallPage as component };
