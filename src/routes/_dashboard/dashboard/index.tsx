import { createFileRoute } from "@tanstack/react-router";

import * as m from "~/i18n/messages";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">
        {m.dashboardTitle()}
      </h1>
      <p className="text-muted-foreground">{m.dashboardWelcome()}</p>
    </div>
  );
}
