import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { lazy, useEffect } from "react";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";

import type { AppSession } from "~/utils/session";
import { ThemeProvider } from "~/components/ThemeProvider";
import { Toaster } from "~/components/ui/sonner";
import { env } from "~/env";
import { useTranslation } from "~/i18n/client";
import { getUserSession } from "~/server/auth.server";
import appCss from "~/styles/globals.scss?url";
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import { NotFound } from "../components/NotFound";
import { seo } from "../utils/seo";

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
  auth?: AppSession;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  beforeLoad: async ({ context }) => {
    const auth = await getUserSession();
    return {
      ...context,
      auth,
    };
  },
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    ...seo({
      title: "TanStack",
      description: "TanStack is a fullstack TypeScript framework",
    }),
  ],
  links: () => [
    { rel: "stylesheet", href: appCss },
    {
      rel: "stylesheet",
      href: "https://js.arcgis.com/4.28/esri/themes/light/main.css",
    },
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
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
        <Toaster />
        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </Body>
    </Html>
  );
}
