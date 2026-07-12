import type { ErrorComponentProps } from "@tanstack/react-router";

import { Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import { RefreshCw, TriangleAlert } from "lucide-react";

import { Button } from "~/components/ui/button";
import * as m from "~/i18n/messages";
import { getMessageFromError } from "~/utils/error";

import { StatusPage } from "./status/StatusPage";

export function DefaultCatchBoundary({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  return (
    <StatusPage
      icon={<TriangleAlert className="size-5" />}
      title={m.errorTitle()}
      description={m.errorBody()}
      actions={
        <>
          <Button
            onClick={() => {
              reset();
              void router.invalidate();
            }}
          >
            <RefreshCw className="size-4" />
            {m.errorRetry()}
          </Button>

          {isRoot ? (
            <Button
              variant="outline"
              render={<Link to="/">{m.errorGoHome()}</Link>}
            />
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                router.history.back();
              }}
            >
              {m.errorGoBack()}
            </Button>
          )}
        </>
      }
    >
      {/* Useful to a developer, meaningless to a user: available, not in their face. */}
      <details className="rounded-md border border-border bg-muted/40 text-start">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground">
          {m.errorDetails()}
        </summary>
        <pre className="overflow-x-auto border-t border-border px-4 py-3 text-xs text-muted-foreground">
          {getMessageFromError(error)}
        </pre>
      </details>
    </StatusPage>
  );
}
