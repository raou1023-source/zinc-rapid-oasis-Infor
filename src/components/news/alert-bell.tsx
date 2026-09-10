import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { enableBrowserNotifications, useAlerts } from "@/lib/news/alerts";
import { cn } from "@/lib/utils";

export function AlertBell() {
  const { t } = useI18n();
  const items = useAlerts((s) => s.items);
  const enabled = useAlerts((s) => s.enabled);
  const markAllRead = useAlerts((s) => s.markAllRead);
  const unread = items.filter((item) => !item.read).length;
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(ev: MouseEvent) {
      if (!box.current?.contains(ev.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label={t.alerts}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
        className="relative inline-flex size-11 items-center justify-center rounded-md border border-rule text-ink hover:border-ink"
      >
        <Bell className="size-4" strokeWidth={1.6} />
        {unread > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 min-w-4 rounded-full bg-vermilion px-1 text-center text-[10px] leading-4 text-paper tabular-nums">
            {unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute top-12 right-0 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-md border border-ink bg-paper p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] tracking-[0.16em] text-muted">{t.alerts}</p>
            <button
              type="button"
              className="h-8 px-2 text-[11px] text-vermilion"
              onClick={() => void enableBrowserNotifications()}
            >
              {enabled ? t.notifyOn : t.notifyOff}
            </button>
          </div>
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">{t.alertsEmpty}</p>
          ) : (
            <ul className="max-h-72 space-y-2 overflow-y-auto">
              {items.slice(0, 12).map((item) => (
                <li key={item.id} className={cn("border-b border-rule pb-2 last:border-0")}>
                  <p className="text-[10px] tracking-[0.14em] text-vermilion">{item.eventLabel}</p>
                  <p className="mt-1 text-[13px] leading-5 text-ink">{item.title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
