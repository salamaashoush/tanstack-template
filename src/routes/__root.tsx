import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useEffect, useState } from "react";

import type { AppSession } from "~/utils/session";

import { Toaster } from "~/components/ui/sonner";
import * as m from "~/i18n/messages";
import { getLocale, getTextDirection } from "~/i18n/runtime";
import { getUserProfileQuery } from "~/queries/user";
import { getUserSession } from "~/server/auth";
import appCss from "~/styles/globals.css?url";

import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import { NotFound } from "../components/NotFound";
import { seo } from "../utils/seo";

// import.meta.env.PROD is statically replaced, so the dynamic import is dropped
// from the production bundle entirely. Do not use the runtime `env` here: it
// resolves PROD to its schema default (false) on the server.
const LazyDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import("../components/Devtools").then((res) => ({
        default: res.Devtools,
      })),
    );

function Devtools() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // The devtools shell is client-only and throws if server-rendered.
  if (!mounted) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <LazyDevtools />
    </Suspense>
  );
}

interface AppRouterContext {
  session?: AppSession;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  beforeLoad: async () => {
    const session = (await getUserSession()) as AppSession | undefined;
    // Return only what this route adds. Router merges it into the existing
    // context, and the return value must be serializable (the QueryClient
    // already in context is not).
    return { session };
  },
  loader: async ({ context }) => {
    const { session, queryClient } = context;
    if (session?.isAuthenticated) {
      await queryClient.ensureQueryData(getUserProfileQuery);
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: m.commonAppName(),
        description: m.commonAppDescription(),
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
  const locale = getLocale();

  return (
    <html suppressHydrationWarning lang={locale} dir={getTextDirection(locale)}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider attribute="class" enableColorScheme enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
        <Devtools />
        <Scripts />
      </body>
    </html>
  );
}
