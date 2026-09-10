import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/use-i18n";

export function DocumentLang() {
  const { meta } = useI18n();
  useEffect(() => {
    document.documentElement.lang = meta.html;
  }, [meta.html]);
  return null;
}
