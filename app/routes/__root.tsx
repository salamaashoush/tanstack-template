import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { lazy, Suspense } from "react";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

import type { AppSession } from "~/utils/session";
import { Toaster } from "~/components/ui/sonner";
import { env } from "~/env";
import { languageTag, setLanguageTag } from "~/i18n/runtime";
import { getUserProfileQuery } from "~/queries/user";
import { queryClient } from "~/queryClient";
import { getUserSession } from "~/server/auth.server";
import appCss from "~/styles/globals.css?url";
import { detectLanguageOnClient, getLocaleDetectorScript } from "~/utils/i18n";
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import { NotFound } from "../components/NotFound";
import { seo } from "../utils/seo";

if (typeof window !== "undefined") {
  const language = detectLanguageOnClient();
  setLanguageTag(language);
}

const TanStackRouterDevtools =
  env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

const ReactQueryDevtools =
  env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-query-devtools").then((res) => ({
          default: res.ReactQueryDevtools,
        })),
      );

interface AppRouterContext {
  session?: AppSession;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  beforeLoad: async ({ context }) => {
    const session = (await getUserSession()) as AppSession | undefined;
    return {
      ...context,
      queryClient,
      session,
    };
  },
  loader: async ({ context }) => {
    const { session } = context;
    if (session && session.isAuthenticated) {
      await queryClient.ensureQueryData(getUserProfileQuery);
    }
  },
  head: () => ({
    // TODO: remove once this is fixed https://github.com/TanStack/router/issues/1992
    scripts: [
      ...(env.DEV
        ? [
            {
              type: "module",
              children: `import RefreshRuntime from "/_build/@react-refresh";
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type`,
            },
          ]
        : []),
      {
        type: "module",
        children: getLocaleDetectorScript({
          defaultLanguage: languageTag(),
        }),
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "ThreatVerse",
        description:
          "ThreatVerse is a platform for sharing and discussing cybersecurity threats.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
      },
      {
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
        rel: "stylesheet",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

interface RootDocumentProps {
  children: ReactNode;
}

function RootDocument({ children }: RootDocumentProps) {
  const lang = languageTag();

  return (
    <html
      suppressHydrationWarning
      lang={lang}
      dir={lang.startsWith("ar") ? "rtl" : "ltr"}
    >
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider attribute="class" enableColorScheme enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
        <Suspense fallback={null}>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
