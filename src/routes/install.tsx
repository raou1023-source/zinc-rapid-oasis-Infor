import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { validateLangSearch } from "@/lib/i18n/search";
import { useI18n } from "@/lib/i18n/use-i18n";
import {
  getDeferredPrompt,
  isIosDevice,
  isInIframe,
  isStandalone,
  promptInstall,
  subscribeInstallPrompt,
} from "@/lib/pwa/prompt";

export const Route = createFileRoute("/install")({
  validateSearch: validateLangSearch,
  component: InstallPage,
});

function InstallPage() {
  const { lang, t } = useI18n();
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setReady(Boolean(getDeferredPrompt()));
    return subscribeInstallPrompt(() => {
      setReady(Boolean(getDeferredPrompt()));
      if (isStandalone()) setInstalled(true);
    });
  }, []);

  const ios = isIosDevice();
  const framed = isInIframe();

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-ink px-4 py-4 md:px-8">
        <Link to="/" search={{ lang }} className="text-[12px] tracking-[0.16em] text-muted">
          {t.back}
        </Link>
        <h1 className="mt-4 font-display text-3xl tracking-tight md:text-4xl">{t.pwaTitle}</h1>
        <p className="mt-2 max-w-lg text-sm leading-6 text-muted">{t.pwaBanner}</p>
      </header>

      <main className="mx-auto max-w-xl px-4 py-10 md:px-0">
        {installed ? (
          <p className="border border-ink px-4 py-6 text-sm">{t.pwaAdded}</p>
        ) : framed ? (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted">{t.pwaOpenTab}</p>
            <a
              href="/install"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-md bg-ink px-5 text-sm text-paper"
            >
              {t.install}
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {ready ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  void promptInstall().then((result) => {
                    setBusy(false);
                    if (result === "accepted") setInstalled(true);
                  });
                }}
                className="inline-flex min-h-12 items-center rounded-md bg-ink px-5 text-sm text-paper disabled:opacity-60"
              >
                {t.pwaReady}
              </button>
            ) : null}

            {ios ? (
              <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-ink">
                <li>{t.pwaIos1}</li>
                <li>{t.pwaIos2}</li>
                <li>{t.pwaIos3}</li>
              </ol>
            ) : !ready ? (
              <p className="text-sm leading-6 text-muted">{t.pwaChrome}</p>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
