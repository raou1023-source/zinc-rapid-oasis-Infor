import { n as LOCALE_META, o as parseLocale, r as MESSAGES } from "./safe-DkHGBtm8.mjs";
import { d as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-i18n-B-n2doA0.js
function useI18n() {
	const lang = useRouterState({ select: (s) => parseLocale(s.location.search.lang) });
	return {
		lang,
		t: MESSAGES[lang],
		meta: LOCALE_META[lang]
	};
}
//#endregion
export { useI18n as t };
