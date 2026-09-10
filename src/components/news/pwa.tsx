import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n/use-i18n";
import {
  captureInstallPrompt,
  getDeferredPrompt,
  isIosDevice,
  isInIframe,
  isStandalone,
  promptInstall,
  registerServiceWorker,
  subscribeInstallPrompt,
} from "@/lib/pwa/prompt";

export function PwaRegister() {
  useEffect(() => {
    void registerServiceWorker();
    return captureInstallPrompt();
  }, []);
  return null;
}

export function InstallButton() {
  const { lang, t } = useI18n();
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (isStandalone()) {
      setHidden(true);
      return;
    }
    setHidden(false);
    setReady(Boolean(getDeferredPrompt()));
    return subscribeInstallPrompt(() => setReady(Boolean(getDeferredPrompt())));
  }, []);

  if (hidden) return null;

  return (
    <Link
      to="/install"
      search={{ lang }}
      onClick={(event) => {
        if (!ready) return;
        event.preventDefault();
        void promptInstall();
      }}
      className="inline-flex h-11 items-center gap-2 rounded-md border border-rule px-3 text-sm text-ink hover:border-ink"
      aria-label={t.install}
    >
      <Download className="size-4" strokeWidth={1.6} />
      <span className="hidden sm:inline">{t.install}</span>
    </Link>
  );
}

export function PwaBanner() {
  const { lang, t } = useI18n();
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-paper px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(26,24,21,0.08)]">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <p className="min-w-0 flex-1 text-[13px] leading-5 text-ink">{t.pwaBanner}</p>
        {isInIframe() ? (
          <a
            href="/install"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center rounded-md bg-ink px-3 text-[13px] text-paper"
          >
            {t.install}
          </a>
        ) : (
          <Link
            to="/install"
            search={{ lang }}
            onClick={(event) => {
              if (!ready) return;
              event.preventDefault();
              void promptInstall().then((result) => {
                if (result === "accepted") setShow(false);
              });
            }}
            className="inline-flex h-10 shrink-0 items-center rounded-md bg-ink px-3 text-[13px] text-paper"
          >
            {t.install}
          </Link>
        )}
        <button
          type="button"
          aria-label={t.close}
          className="inline-flex size-10 shrink-0 items-center justify-center text-muted"
          onClick={() => {
            sessionStorage.setItem("inho-pwa-dismiss", "1");
            setShow(false);
          }}
        >
          <X className="size-4" strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}
