import type { ReactNode } from "react";

import { Link, useRouter } from "@tanstack/react-router";
import { Compass } from "lucide-react";

import { Button } from "~/components/ui/button";
import * as m from "~/i18n/messages";

import { StatusPage } from "./status/StatusPage";

interface NotFoundProps {
  /** Overrides the default description, for route-specific wording. */
  children?: ReactNode;
}

export function NotFound({ children }: NotFoundProps) {
  const router = useRouter();

  return (
    <StatusPage
      code="404"
      icon={<Compass className="size-5" />}
      title={m.notFoundTitle()}
      description={typeof children === "string" ? children : m.notFoundBody()}
      actions={
        <>
          <Button render={<Link to="/">{m.notFoundGoHome()}</Link>} />
          <Button
            variant="outline"
            onClick={() => {
              router.history.back();
            }}
          >
            {m.notFoundGoBack()}
          </Button>
        </>
      }
    >
      {typeof children === "string" ? null : children}
    </StatusPage>
  );
}
