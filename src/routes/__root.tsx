import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppQueryProvider } from "@/components/news/query-provider";
import { DocumentLang } from "@/components/news/document-lang";
import { PwaRegister } from "@/components/news/pwa";
import { validateLangSearch } from "@/lib/i18n/search";
import appCss from "../styles.css?url";

const APP_NAME = "In報";

export const Route = createRootRoute({
  validateSearch: validateLangSearch,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#F4EFE6" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "application-name", content: APP_NAME },
      {
        name: "description",
        content: "Entertainment, politics, sports and business news in Japanese, English, Chinese and Korean.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600&family=Noto+Sans+KR:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&family=Shippori+Mincho:wght@500;600;700&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="ja" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <PwaRegister />
        <AuthProvider>
          <AppQueryProvider>
            <DocumentLang />
            <Outlet />
          </AppQueryProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
