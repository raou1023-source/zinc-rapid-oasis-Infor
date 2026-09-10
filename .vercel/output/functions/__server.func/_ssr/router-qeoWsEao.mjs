import { i as __toESM } from "../_runtime.mjs";
import { a as isArticleId, o as parseLocale } from "./safe-DkHGBtm8.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useI18n } from "./use-i18n-B-n2doA0.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as Download, n as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prompt-CaeXdinr.js
var deferred = null;
var listeners = /* @__PURE__ */ new Set();
function notify() {
	for (const fn of listeners) fn();
}
function isStandalone() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(display-mode: standalone)").matches || "standalone" in navigator && Boolean(navigator.standalone);
}
function isIosDevice() {
	if (typeof navigator === "undefined") return false;
	return /iphone|ipad|ipod/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
function isInIframe() {
	if (typeof window === "undefined") return false;
	return window.self !== window.top;
}
function subscribeInstallPrompt(fn) {
	listeners.add(fn);
	return () => {
		listeners.delete(fn);
	};
}
function getDeferredPrompt() {
	return deferred;
}
function captureInstallPrompt() {
	if (typeof window === "undefined") return () => {};
	function onPrompt(event) {
		event.preventDefault();
		deferred = event;
		notify();
	}
	function onInstalled() {
		deferred = null;
		notify();
	}
	window.addEventListener("beforeinstallprompt", onPrompt);
	window.addEventListener("appinstalled", onInstalled);
	return () => {
		window.removeEventListener("beforeinstallprompt", onPrompt);
		window.removeEventListener("appinstalled", onInstalled);
	};
}
async function promptInstall() {
	if (!deferred) return "unavailable";
	const event = deferred;
	deferred = null;
	notify();
	await event.prompt();
	return (await event.userChoice).outcome === "accepted" ? "accepted" : "dismissed";
}
async function registerServiceWorker() {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
	if (isInIframe()) {
		const regs = await navigator.serviceWorker.getRegistrations();
		await Promise.all(regs.map((reg) => reg.unregister()));
		return;
	}
	await navigator.serviceWorker.register("/sw.js", {
		scope: "/",
		updateViaCache: "none"
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/server-CjnF-S7A.js
function validateLangSearch(search) {
	if (typeof search.lang !== "string" || search.lang.trim() === "") return {};
	return { lang: parseLocale(search.lang) };
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getNews = createServerFn({ method: "POST" }).validator((data) => ({ lang: parseLocale(data?.lang) })).handler(createSsrRpc("f83726ec62b4844a0fb54d8984156fd242fbfc593dd47859ff1754beb11bac3e"));
var getArticle = createServerFn({ method: "POST" }).validator((data) => ({
	id: isArticleId(data.id) ? data.id : "",
	lang: parseLocale(data.lang)
})).handler(createSsrRpc("2cfd3bab1d80196bfc55c67eed770c6fa6fcde12277a6db4126af0cdbe297445"));
var getSportNews = createServerFn({ method: "POST" }).validator((data) => ({
	sport: /^[a-z0-9-]{1,32}$/.test(String(data.sport ?? "")) ? String(data.sport) : "",
	lang: parseLocale(data.lang)
})).handler(createSsrRpc("f91f64fa300b05cb48f7a3e56d3bea704126251656178c86b34c9ea38f5794be"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-qeoWsEao.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function AppQueryProvider({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 6e4,
		refetchOnWindowFocus: false,
		retry: 1
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client,
		children
	});
}
function DocumentLang() {
	const { meta } = useI18n();
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = meta.html;
	}, [meta.html]);
	return null;
}
function PwaRegister() {
	(0, import_react.useEffect)(() => {
		registerServiceWorker();
		return captureInstallPrompt();
	}, []);
	return null;
}
function InstallButton() {
	const { lang, t } = useI18n();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [hidden, setHidden] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (isStandalone()) {
			setHidden(true);
			return;
		}
		setHidden(false);
		setReady(Boolean(getDeferredPrompt()));
		return subscribeInstallPrompt(() => setReady(Boolean(getDeferredPrompt())));
	}, []);
	if (hidden) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/install",
		search: { lang },
		onClick: (event) => {
			if (!ready) return;
			event.preventDefault();
			promptInstall();
		},
		className: "inline-flex h-11 items-center gap-2 rounded-md border border-rule px-3 text-sm text-ink hover:border-ink",
		"aria-label": t.install,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
			className: "size-4",
			strokeWidth: 1.6
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: t.install
		})]
	});
}
function PwaBanner() {
	const { lang, t } = useI18n();
	const [show, setShow] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isStandalone()) return;
		if (sessionStorage.getItem("inho-pwa-dismiss") === "1") return;
		setReady(Boolean(getDeferredPrompt()));
		setShow(Boolean(getDeferredPrompt()) || isIosDevice() || isInIframe());
		return subscribeInstallPrompt(() => {
			setReady(Boolean(getDeferredPrompt()));
			setShow(true);
		});
	}, []);
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-paper px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(26,24,21,0.08)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "min-w-0 flex-1 text-[13px] leading-5 text-ink",
					children: t.pwaBanner
				}),
				isInIframe() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/install",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex h-10 shrink-0 items-center rounded-md bg-ink px-3 text-[13px] text-paper",
					children: t.install
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/install",
					search: { lang },
					onClick: (event) => {
						if (!ready) return;
						event.preventDefault();
						promptInstall().then((result) => {
							if (result === "accepted") setShow(false);
						});
					},
					className: "inline-flex h-10 shrink-0 items-center rounded-md bg-ink px-3 text-[13px] text-paper",
					children: t.install
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": t.close,
					className: "inline-flex size-10 shrink-0 items-center justify-center text-muted",
					onClick: () => {
						sessionStorage.setItem("inho-pwa-dismiss", "1");
						setShow(false);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "size-4",
						strokeWidth: 1.6
					})
				})
			]
		})
	});
}
var styles_default = "/assets/styles-bwps-BF5.css";
var APP_NAME = "In報";
var Route$4 = createRootRoute({
	validateSearch: validateLangSearch,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#F4EFE6"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: APP_NAME
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default"
			},
			{
				name: "application-name",
				content: APP_NAME
			},
			{
				name: "description",
				content: "Entertainment, politics, sports and business news in Japanese, English, Chinese and Korean."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
				sizes: "180x180"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600&family=Noto+Sans+KR:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&family=Shippori+Mincho:wght@500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ja",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaRegister, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppQueryProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentLang, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$3 = () => import("./routes-xSzJ5vJd.mjs");
var Route$3 = createFileRoute("/")({
	validateSearch: validateLangSearch,
	loaderDeps: ({ search: { lang } }) => ({ lang }),
	staleTime: 12e4,
	pendingMs: 200,
	loader: ({ deps: { lang } }) => getNews({ data: { lang } }),
	pendingComponent: HomePending,
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function HomePending() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 border-b border-ink" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 bg-ink" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 border-b border-rule" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-8 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-6 h-8 w-40 bg-rule/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 border-b border-rule" }, i))
				})]
			})
		]
	});
}
var $$splitComponentImporter$2 = () => import("./install-yiRSAJZJ.mjs");
var Route$2 = createFileRoute("/install")({
	validateSearch: validateLangSearch,
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./saved-DpRaUII5.mjs");
var Route$1 = createFileRoute("/saved")({
	validateSearch: validateLangSearch,
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./article._id-BneqWlUO.mjs");
var Route = createFileRoute("/article/$id")({
	validateSearch: validateLangSearch,
	loaderDeps: ({ search: { lang } }) => ({ lang }),
	staleTime: 6e4,
	loader: async ({ deps, params }) => {
		const [article, news] = await Promise.all([getArticle({ data: {
			id: params.id,
			lang: deps.lang
		} }), getNews({ data: { lang: deps.lang } })]);
		return {
			article,
			news
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	InstallRoute: Route$2.update({
		id: "/install",
		path: "/install",
		getParentRoute: () => Route$4
	}),
	SavedRoute: Route$1.update({
		id: "/saved",
		path: "/saved",
		getParentRoute: () => Route$4
	}),
	ArticleIdRoute: Route.update({
		id: "/article/$id",
		path: "/article/$id",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 3e4
	});
}
//#endregion
export { PwaBanner as a, getDeferredPrompt as c, isStandalone as d, promptInstall as f, InstallButton as i, isInIframe as l, Route as n, getNews as o, subscribeInstallPrompt as p, Route$3 as r, getSportNews as s, router_exports as t, isIosDevice as u };
