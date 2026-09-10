import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useAlerts } from "@/lib/news/alerts";

export function AlertToasts() {
  const { lang, t } = useI18n();
  const toasts = useAlerts((s) => s.toasts);
  const dismissToast = useAlerts((s) => s.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((item) =>
      window.setTimeout(() => dismissToast(item.id), item.urgent ? 16000 : 10000),
    );
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [toasts, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-[max(5.5rem,env(safe-area-inset-top))] right-3 z-50 flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-2">
      {toasts.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto border border-ink bg-paper px-3 py-3 shadow-[0_8px_24px_rgba(26,24,21,0.12)]"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] tracking-[0.18em] text-vermilion">{item.urgent ? t.disaster : t.breaking}</p>
            <button type="button" aria-label={t.close} onClick={() => dismissToast(item.id)} className="text-muted">
              <X className="size-3.5" />
            </button>
          </div>
          <Link
            to="/article/$id"
            params={{ id: item.id }}
            search={{ lang }}
            onClick={() => dismissToast(item.id)}
            className="mt-1 block font-display text-[0.95rem] leading-snug text-ink hover:text-vermilion"
          >
            {item.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
