import { createFileRoute } from "@tanstack/react-router";

import { SignUpForm } from "~/components/auth/SignUpForm";
import { useTranslation } from "~/i18n/client";

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUpPage,
});

export default function SignUpPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-[32px] font-semibold text-foreground">
          {t("auth.signUp.title")}
        </h1>
        <p className="text-muted-foreground">{t("auth.signUp.body")}</p>
      </div>
      <SignUpForm />
    </>
  );
}
