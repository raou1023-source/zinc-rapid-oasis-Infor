//#region node_modules/.nitro/vite/services/ssr/assets/seen-B0GYTYYm.js
var KEY = "inho-seen-articles";
function readAll() {
	if (typeof sessionStorage === "undefined") return [];
	try {
		const raw = sessionStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter((a) => a && typeof a.id === "string") : [];
	} catch {
		return [];
	}
}
function rememberArticles(list) {
	if (typeof sessionStorage === "undefined" || list.length === 0) return;
	try {
		const map = new Map(readAll().map((a) => [a.id, a]));
		for (const article of list) map.set(article.id, article);
		sessionStorage.setItem(KEY, JSON.stringify([...map.values()].slice(-240)));
	} catch {}
}
function recallArticle(id) {
	return readAll().find((a) => a.id === id) ?? null;
}
//#endregion
export { rememberArticles as n, recallArticle as t };
