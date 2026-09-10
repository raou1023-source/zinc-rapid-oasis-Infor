import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useI18n } from "./use-i18n-B-n2doA0.mjs";
import { a as Bookmark, o as Bell, r as Search, t as X } from "../_libs/lucide-react.mjs";
import { a as PwaBanner, i as InstallButton, o as getNews, r as Route$3, s as getSportNews } from "./router-qeoWsEao.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { a as formatFetched, c as useBookmarks, i as formatClock, n as LanguageSwitcher, o as formatMastheadDate, r as cn } from "./format-BRl3F0La.mjs";
import { n as rememberArticles } from "./seen-B0GYTYYm.mjs";
import { a as scoreImpact, i as rankBySport, l as DISASTER_EVENT_ID, n as SPORTS, r as findSportsByQuery, t as CATEGORIES } from "./types-CFI7EBnR.mjs";
import { t as ArticleCard } from "./article-card-EYccTpDO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-xSzJ5vJd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryNav({ value, onChange, events }) {
	const { t } = useI18n();
	const tabs = [
		{
			id: "all",
			label: t.all
		},
		...events.length > 0 ? [{
			id: "special",
			label: t.special,
			special: true
		}] : [],
		...CATEGORIES.map((id) => ({
			id,
			label: t.categories[id]
		}))
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": t.nav,
		className: "sticky top-0 z-20 border-b border-rule bg-paper/95 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-0 overflow-x-auto px-2 md:px-6",
			children: tabs.map((tab) => {
				const active = tab.id === value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onChange(tab.id),
					className: cn("relative min-h-12 shrink-0 px-4 text-sm tracking-[0.08em] transition-colors", active ? "font-medium text-ink" : "text-muted hover:text-ink", tab.special && !active && "text-vermilion"),
					children: [tab.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute inset-x-3 bottom-0 h-[2px] origin-center transition-transform", tab.special ? "bg-vermilion" : "bg-ink", active ? "scale-x-100" : "scale-x-0") })]
				}, tab.id);
			})
		})
	});
}
var MAX_ITEMS = 40;
var IMPACT_LABEL = {
	ja: {
		disaster: "地震・災害",
		crisis: "重大",
		breaking: "速報"
	},
	en: {
		disaster: "Disaster",
		crisis: "Major",
		breaking: "Breaking"
	},
	zh: {
		disaster: "灾害",
		crisis: "重大",
		breaking: "快讯"
	},
	ko: {
		disaster: "재해",
		crisis: "중대",
		breaking: "속보"
	}
};
function isTopFrame() {
	if (typeof window === "undefined") return false;
	return window.self === window.top;
}
var useAlerts = create()(persist((set, get) => ({
	enabled: true,
	seenIds: [],
	items: [],
	toasts: [],
	setEnabled: (enabled) => set({ enabled }),
	ingest: (events, articles, lang) => {
		const seen = new Set(get().seenIds);
		const fresh = [];
		const now = Date.now();
		const labels = IMPACT_LABEL[lang];
		for (const article of articles) {
			if (seen.has(article.id)) continue;
			const impact = scoreImpact(article);
			const isDisaster = article.eventIds?.includes("disaster-alert") || impact?.kind === "disaster";
			const desk = events.find((event) => article.eventIds?.includes(event.id));
			const high = Boolean(impact && impact.score >= 5);
			if ((article.publishedMs > 0 ? now - article.publishedMs : 0) > (isDisaster ? 288e5 : 216e5)) {
				seen.add(article.id);
				continue;
			}
			if (!isDisaster && !high && !desk) continue;
			seen.add(article.id);
			const kind = isDisaster ? "disaster" : impact?.kind === "crisis" ? "crisis" : "breaking";
			fresh.push({
				id: article.id,
				eventId: isDisaster ? DISASTER_EVENT_ID : high ? `impact-${kind}` : desk.id,
				eventLabel: isDisaster ? labels.disaster : high ? labels[kind] : desk.label[lang],
				title: article.title,
				at: article.publishedMs || now,
				read: false,
				urgent: Boolean(isDisaster || impact?.urgent)
			});
		}
		if (fresh.length === 0 && get().items.length === 0) {
			const seed = articles.filter((article) => !seen.has(article.id)).slice(0, 2).map((article) => {
				seen.add(article.id);
				return {
					id: article.id,
					eventId: "impact-breaking",
					eventLabel: labels.breaking,
					title: article.title,
					at: article.publishedMs || now,
					read: false,
					urgent: false
				};
			});
			if (seed.length > 0) fresh.push(...seed);
		}
		if (fresh.length === 0) {
			set({ seenIds: [...seen].slice(-400) });
			return [];
		}
		fresh.sort((a, b) => Number(b.urgent) - Number(a.urgent) || b.at - a.at);
		const capped = fresh.slice(0, 4);
		set({
			seenIds: [...seen].slice(-400),
			items: [...capped, ...get().items].slice(0, MAX_ITEMS),
			toasts: [...capped, ...get().toasts].slice(0, 4)
		});
		return capped;
	},
	markAllRead: () => set({ items: get().items.map((item) => ({
		...item,
		read: true
	})) }),
	dismissToast: (id) => set({ toasts: get().toasts.filter((item) => item.id !== id) })
}), {
	name: "inho-alerts-v2",
	partialize: (state) => ({
		enabled: state.enabled,
		seenIds: state.seenIds,
		items: state.items
	})
}));
async function enableBrowserNotifications() {
	if (typeof Notification === "undefined") {
		useAlerts.getState().setEnabled(true);
		return false;
	}
	if (!isTopFrame()) {
		useAlerts.getState().setEnabled(true);
		return false;
	}
	const ok = (Notification.permission === "granted" ? "granted" : await Notification.requestPermission()) === "granted";
	useAlerts.getState().setEnabled(true);
	return ok;
}
async function pushBrowserNotifications(items) {
	if (typeof window === "undefined" || items.length === 0) return;
	if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
	const ordered = [...items].sort((a, b) => Number(b.urgent) - Number(a.urgent)).slice(0, 4);
	let shown = false;
	try {
		const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.ready : null;
		if (reg?.showNotification) {
			for (const item of ordered) await reg.showNotification(item.eventLabel.slice(0, 60), {
				body: item.title.slice(0, 140),
				tag: item.urgent ? `urgent-${item.id}` : item.id,
				requireInteraction: Boolean(item.urgent),
				data: { url: `/article/${item.id}` }
			});
			shown = true;
		}
	} catch {
		shown = false;
	}
	if (shown) return;
	for (const item of ordered) try {
		new Notification(item.eventLabel.slice(0, 60), {
			body: item.title.slice(0, 140),
			tag: item.urgent ? `urgent-${item.id}` : item.id,
			requireInteraction: Boolean(item.urgent)
		});
	} catch {}
}
async function notifyFresh(items) {
	if (items.length === 0) return;
	useAlerts.getState().setEnabled(true);
	await pushBrowserNotifications(items);
}
function AlertBell() {
	const { t } = useI18n();
	const items = useAlerts((s) => s.items);
	const enabled = useAlerts((s) => s.enabled);
	const markAllRead = useAlerts((s) => s.markAllRead);
	const unread = items.filter((item) => !item.read).length;
	const [open, setOpen] = (0, import_react.useState)(false);
	const box = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function onDoc(ev) {
			if (!box.current?.contains(ev.target)) setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: box,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-label": t.alerts,
			onClick: () => {
				setOpen((v) => !v);
				if (!open) markAllRead();
			},
			className: "relative inline-flex size-11 items-center justify-center rounded-md border border-rule text-ink hover:border-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
				className: "size-4",
				strokeWidth: 1.6
			}), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -top-1.5 -right-1.5 min-w-4 rounded-full bg-vermilion px-1 text-center text-[10px] leading-4 text-paper tabular-nums",
				children: unread
			}) : null]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-12 right-0 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-md border border-ink bg-paper p-3 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.16em] text-muted",
					children: t.alerts
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-8 px-2 text-[11px] text-vermilion",
					onClick: () => void enableBrowserNotifications(),
					children: enabled ? t.notifyOn : t.notifyOff
				})]
			}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-6 text-center text-sm text-muted",
				children: t.alertsEmpty
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-72 space-y-2 overflow-y-auto",
				children: items.slice(0, 12).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("border-b border-rule pb-2 last:border-0"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] tracking-[0.14em] text-vermilion",
						children: item.eventLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[13px] leading-5 text-ink",
						children: item.title
					})]
				}, item.id))
			})]
		}) : null]
	});
}
function Masthead({ query, onQueryChange }) {
	const { lang, t, meta } = useI18n();
	const savedCount = useBookmarks((s) => s.items.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "border-b border-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 border-b border-rule px-4 py-2 text-[11px] tracking-[0.16em] text-muted md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate",
				suppressHydrationWarning: true,
				children: formatMastheadDate(lang)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitcher, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "hidden shrink-0 tabular-nums sm:block",
					suppressHydrationWarning: true,
					children: [
						formatClock(lang),
						" JST · ",
						t.city
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-stretch gap-4 px-4 py-5 md:flex-row md:items-end md:justify-between md:px-8 md:py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				search: { lang },
				className: "group min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-1 text-[10px] tracking-[0.42em] text-vermilion",
						children: [meta.edition, " EDITION"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-baseline gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-[2.6rem] leading-none tracking-[-0.04em] text-ink md:text-[3.4rem]",
							children: "In報"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-md text-[12px] leading-5 text-muted",
						children: t.tagline
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative min-w-0 flex-1 md:w-64 md:flex-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => onQueryChange(e.target.value),
							placeholder: t.search,
							suppressHydrationWarning: true,
							className: "h-11 w-full rounded-md border border-rule bg-paper-2 pr-3 pl-9 text-sm text-ink outline-none placeholder:text-faint focus:border-ink"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertBell, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallButton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/saved",
						search: { lang },
						className: "relative inline-flex h-11 items-center gap-2 rounded-md border border-rule px-3 text-sm text-ink hover:border-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
								className: "size-4",
								strokeWidth: 1.6
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: t.saved
							}),
							savedCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-1.5 -right-1.5 min-w-4 rounded-full bg-vermilion px-1 text-center text-[10px] leading-4 text-paper tabular-nums",
								children: savedCount
							}) : null
						]
					})
				]
			})]
		})]
	});
}
function byFreshness(articles) {
	return [...articles].sort((a, b) => b.publishedMs - a.publishedMs);
}
function latestUpdates(articles, limit = 12) {
	const now = Date.now();
	const day = 864e5;
	const fresh = byFreshness(articles).filter((a) => now - a.publishedMs < day && a.publishedMs <= now + 3e5);
	if (fresh.length >= 6) return fresh.slice(0, limit);
	return byFreshness(articles).slice(0, limit);
}
function Ticker({ articles }) {
	const { lang, t } = useI18n();
	const line = [
		...latestUpdates(articles, 16).filter((a) => a.eventIds?.includes("disaster-alert") || a.urgent),
		...latestUpdates(articles, 16).filter((a) => a.impact && !a.urgent && !a.eventIds?.includes("disaster-alert")),
		...latestUpdates(articles, 16).filter((a) => !a.impact && !a.urgent && !a.eventIds?.includes("disaster-alert"))
	].slice(0, 16);
	if (line.length === 0) return null;
	const doubled = [...line, ...line];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ticker-wrap flex overflow-hidden border-b border-ink bg-ink text-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "flex shrink-0 items-center border-r border-paper/20 px-4 py-3.5 text-[12px] font-medium tracking-[0.22em]",
			children: t.breaking
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative flex-1 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ticker-track flex w-max gap-12 py-3.5 pr-12",
				children: doubled.map((article, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/article/$id",
					params: { id: article.id },
					search: { lang },
					preload: false,
					className: "flex items-center gap-3.5 text-[15px] leading-snug text-paper hover:text-vermilion-soft md:text-[16px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[12px] tracking-[0.14em] text-vermilion-soft",
						children: t.categories[article.category]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "whitespace-nowrap",
						children: article.title
					})]
				}, `${article.id}-${i}`))
			})
		})]
	});
}
function AlertToasts() {
	const { lang, t } = useI18n();
	const toasts = useAlerts((s) => s.toasts);
	const dismissToast = useAlerts((s) => s.dismissToast);
	(0, import_react.useEffect)(() => {
		if (toasts.length === 0) return;
		const timers = toasts.map((item) => window.setTimeout(() => dismissToast(item.id), item.urgent ? 16e3 : 1e4));
		return () => {
			for (const timer of timers) window.clearTimeout(timer);
		};
	}, [toasts, dismissToast]);
	if (toasts.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed top-[max(5.5rem,env(safe-area-inset-top))] right-3 z-50 flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-2",
		children: toasts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto border border-ink bg-paper px-3 py-3 shadow-[0_8px_24px_rgba(26,24,21,0.12)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] tracking-[0.18em] text-vermilion",
					children: item.urgent ? t.disaster : t.breaking
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": t.close,
					onClick: () => dismissToast(item.id),
					className: "text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/article/$id",
				params: { id: item.id },
				search: { lang },
				onClick: () => dismissToast(item.id),
				className: "mt-1 block font-display text-[0.95rem] leading-snug text-ink hover:text-vermilion",
				children: item.title
			})]
		}, item.id))
	});
}
function SportsDesk({ articles, seedQuery = "" }) {
	const { lang, t } = useI18n();
	const [q, setQ] = (0, import_react.useState)(seedQuery);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [extra, setExtra] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (seedQuery) {
			setQ(seedQuery);
			setPicked(null);
		}
	}, [seedQuery]);
	const matched = (0, import_react.useMemo)(() => findSportsByQuery(q), [q]);
	const activeIds = (0, import_react.useMemo)(() => {
		if (picked) return [picked];
		return matched.map((sport) => sport.id);
	}, [picked, matched]);
	(0, import_react.useEffect)(() => {
		const sport = activeIds[0];
		if (!sport) {
			setExtra([]);
			return;
		}
		let alive = true;
		const timer = window.setTimeout(() => {
			getSportNews({ data: {
				sport,
				lang
			} }).then((list) => {
				if (!alive) return;
				rememberArticles(list);
				setExtra(list);
			});
		}, 220);
		return () => {
			alive = false;
			window.clearTimeout(timer);
		};
	}, [activeIds, lang]);
	const merged = (0, import_react.useMemo)(() => {
		const seen = new Set(articles.map((a) => a.id));
		const rest = extra.filter((a) => !seen.has(a.id));
		return rankBySport([...articles, ...rest], activeIds);
	}, [
		articles,
		extra,
		activeIds
	]);
	const chips = SPORTS;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] tracking-[0.28em] text-vermilion",
					children: t.kickers.sports
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative w-full md:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => {
							setQ(e.target.value.slice(0, 80));
							setPicked(null);
						},
						placeholder: t.sportSearch,
						className: "h-11 w-full rounded-md border border-rule bg-paper-2 pr-3 pl-9 text-sm text-ink outline-none placeholder:text-faint focus:border-ink"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setPicked(null);
						setQ("");
					},
					className: cn("h-9 shrink-0 rounded-full border px-3 text-[12px]", !picked && !q ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink"),
					children: t.sportAll
				}), chips.map((sport) => {
					const on = picked === sport.id || matched.some((item) => item.id === sport.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setPicked(sport.id);
							setQ(sport.labels[lang]);
						},
						className: cn("h-9 shrink-0 rounded-full border px-3 text-[12px]", on ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink"),
						children: sport.labels[lang]
					}, sport.id);
				})]
			}),
			activeIds.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 text-[12px] text-muted",
				children: [
					t.sportPriority,
					": ",
					activeIds.map((id) => SPORTS.find((s) => s.id === id)?.labels[lang]).filter(Boolean).join(" / ")
				]
			}) : null,
			merged.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-12 text-center text-sm text-muted",
				children: t.empty
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-x-10 md:grid-cols-2",
				children: merged.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article }, article.id))
			})
		]
	});
}
function RegionDesk({ articles, category }) {
	const { t } = useI18n();
	const domestic = byFreshness(articles.filter((a) => a.region !== "overseas"));
	const overseas = byFreshness(articles.filter((a) => a.region === "overseas"));
	if (domestic.length === 0 && overseas.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-16 text-center text-sm text-muted",
		children: t.empty
	});
	const columns = [{
		key: "overseas",
		title: t.musicOverseas,
		kicker: "WORLD",
		list: overseas
	}, {
		key: "domestic",
		title: t.musicDomestic,
		kicker: "JAPAN",
		list: domestic
	}].filter((col) => col.list.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-[10px] tracking-[0.28em] text-vermilion",
			children: t.kickers[category]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `grid gap-10 ${columns.length > 1 ? "md:grid-cols-2" : ""}`,
			children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-baseline justify-between border-b border-ink pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl tracking-tight",
					children: col.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] tracking-[0.2em] text-muted",
					children: col.kicker
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-rule",
				children: col.list.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article }, article.id))
			})] }, col.key))
		})]
	});
}
function MusicDesk({ articles }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegionDesk, {
		articles,
		category: "music"
	});
}
function PoliticsDesk({ articles }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegionDesk, {
		articles,
		category: "politics"
	});
}
function Home() {
	const loaded = Route$3.useLoaderData();
	const { lang, t } = useI18n();
	const [news, setNews] = (0, import_react.useState)(loaded);
	const [tab, setTab] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const ingest = useAlerts((s) => s.ingest);
	const retries = (0, import_react.useRef)(0);
	const langRef = (0, import_react.useRef)(lang);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (langRef.current !== lang) {
			langRef.current = lang;
			retries.current = 0;
			setNews(loaded);
		}
	}, [lang, loaded]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const apply = (next) => {
			if (!alive || next.articles.length === 0) return;
			const y = window.scrollY;
			setNews(next);
			requestAnimationFrame(() => {
				window.scrollTo({
					top: y,
					left: 0,
					behavior: "instant"
				});
			});
		};
		if (loaded.articles.length === 0 && retries.current < 1) {
			retries.current += 1;
			window.setTimeout(() => {
				getNews({ data: { lang } }).then(apply);
			}, 1400);
		}
		const tick = window.setInterval(() => {
			if (document.visibilityState !== "visible") return;
			getNews({ data: { lang } }).then(apply);
		}, 45e3);
		return () => {
			alive = false;
			window.clearInterval(tick);
		};
	}, [lang, loaded.articles.length]);
	const articles = (0, import_react.useMemo)(() => byFreshness(news.articles), [news.articles]);
	const events = news.events ?? [];
	const latest = (0, import_react.useMemo)(() => latestUpdates(articles, 10), [articles]);
	(0, import_react.useEffect)(() => {
		rememberArticles(articles);
	}, [articles]);
	(0, import_react.useEffect)(() => {
		if (!hydrated || articles.length === 0) return;
		const fresh = ingest(events, articles, lang);
		if (fresh.length > 0) notifyFresh(fresh);
	}, [
		hydrated,
		articles,
		events,
		ingest,
		lang
	]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim();
		return articles.filter((a) => {
			if (tab === "special") {
				if (!a.eventIds?.length) return false;
			} else if (tab !== "all" && a.category !== tab) return false;
			if (!q) return true;
			return a.title.includes(q) || a.source.includes(q) || a.summary.includes(q);
		});
	}, [
		articles,
		tab,
		query
	]);
	const featured = tab === "all" && !query ? latest[0] : void 0;
	const rest = featured ? filtered.filter((a) => a.id !== featured.id) : filtered;
	const liveEvents = events.filter((event) => event.count > 0);
	const categoryDesks = CATEGORIES.map((cat) => ({
		cat,
		list: byFreshness(articles.filter((a) => a.category === cat)).slice(0, 8)
	})).filter((desk) => desk.list.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Masthead, {
				query,
				onQueryChange: setQuery
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticker, { articles }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertToasts, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryNav, {
				value: tab,
				onChange: setTab,
				events: liveEvents
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pb-16 md:px-8",
				children: [
					tab === "special" && liveEvents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-b border-ink py-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] tracking-[0.28em] text-vermilion",
								children: t.special
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-2xl tracking-tight md:text-3xl",
								children: t.special
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: liveEvents.map((event) => event.label[lang]).join(" / ")
							})
						]
					}) : null,
					featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-b border-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pt-5 text-[10px] tracking-[0.28em] text-vermilion",
							children: t.topStory
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
							article: featured,
							featured: true
						})]
					}) : null,
					tab === "all" && !query && latest.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-b border-rule py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-[10px] tracking-[0.28em] text-vermilion",
							children: t.latest
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid gap-x-8 gap-y-3 md:grid-cols-2",
							children: latest.slice(1, 9).map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
								article,
								compact: true
							}) }, article.id))
						})]
					}) : null,
					tab === "all" && !query && liveEvents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-b border-rule py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTab("special"),
							className: "mb-4 text-left",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] tracking-[0.28em] text-vermilion",
								children: t.special
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
							children: liveEvents.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTab("special"),
								className: "border border-rule px-4 py-3 text-left hover:border-ink",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] tracking-[0.16em] text-vermilion",
										children: t.categories[event.category]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-display text-lg tracking-tight",
										children: event.label[lang]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[12px] leading-5 text-muted",
										children: event.blurb[lang]
									})
								]
							}, event.id))
						})]
					}) : null,
					tab === "special" && !query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-10 py-8",
						children: CATEGORIES.map((cat) => {
							const desks = liveEvents.filter((event) => event.category === cat).map((event) => ({
								event,
								list: articles.filter((a) => a.eventIds?.includes(event.id)).slice(0, 5)
							})).filter((desk) => desk.list.length > 0);
							if (desks.length === 0) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-4 border-b border-ink pb-2 font-display text-xl tracking-tight",
								children: t.categories[cat]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-8 md:grid-cols-2",
								children: desks.map(({ event, list }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] tracking-[0.18em] text-vermilion",
										children: event.kicker
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-display text-lg",
										children: event.label[lang]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 mb-3 text-[12px] text-muted",
										children: event.blurb[lang]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "divide-y divide-rule",
										children: list.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "py-3 first:pt-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
												article,
												compact: true
											})
										}, article.id))
									})
								] }, event.id))
							})] }, cat);
						})
					}) : null,
					filtered.length === 0 && tab !== "special" && tab !== "sports" && tab !== "music" && tab !== "politics" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-16 text-center text-sm text-muted",
						children: t.empty
					}) : null,
					tab === "sports" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SportsDesk, {
						articles: articles.filter((a) => a.category === "sports"),
						seedQuery: query
					}) : tab === "music" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicDesk, { articles: articles.filter((a) => a.category === "music") }) : tab === "politics" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoliticsDesk, { articles: articles.filter((a) => a.category === "politics") }) : tab !== "special" && tab === "all" && !query && categoryDesks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: `grid gap-8 border-b border-rule py-8 sm:grid-cols-2 ${categoryDesks.length >= 6 ? "lg:grid-cols-3 xl:grid-cols-6" : categoryDesks.length >= 5 ? "lg:grid-cols-5" : categoryDesks.length >= 3 ? "lg:grid-cols-3" : ""}`,
						children: categoryDesks.map(({ cat, list }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab(cat),
							className: "mb-3 flex w-full items-baseline justify-between border-b border-ink pb-2 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl tracking-tight",
								children: t.categories[cat]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] tracking-[0.2em] text-muted",
								children: t.kickers[cat]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-rule",
							children: list.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "py-3 first:pt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
									article,
									compact: true
								})
							}, article.id))
						})] }, cat))
					}) : tab !== "special" && rest.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "grid gap-x-10 md:grid-cols-2",
						children: rest.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, { article }, article.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "mt-12 border-t border-rule pt-6 text-[11px] leading-5 text-faint",
						children: [t.footer, news.fetchedAt ? ` ${t.fetched} ${formatFetched(news.fetchedAt, lang)}` : null]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaBanner, {})
		]
	});
}
//#endregion
export { Home as component };
