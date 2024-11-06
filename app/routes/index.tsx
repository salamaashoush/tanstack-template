import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useTranslation } from "~/i18n/client";

export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/home",
      });
    }
  },
});

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Card>
      <h1>{t("home.title")}</h1>
      <p>{t("home.welcome")}</p>
      <Button
        onClick={() =>
          navigate({
            to: "/login",
          })
        }
      >
        {t("home.actions.login")}
      </Button>
      <Button
        onClick={() =>
          navigate({
            to: "/register",
          })
        }
      >
        {t("home.actions.register")}
      </Button>
    </Card>
  );
}
