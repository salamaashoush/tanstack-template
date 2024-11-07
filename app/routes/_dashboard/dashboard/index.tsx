import { createFileRoute } from "@tanstack/react-router";

import { useTranslation } from "~/i18n/client";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">
        {t("dashboard.title")}
      </h1>
      <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
    </div>
  );
}
