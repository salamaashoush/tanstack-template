import { createFileRoute } from "@tanstack/react-router";

import { SignInForm } from "~/components/auth/SignInForm";
import { useTranslation } from "~/i18n/client";

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInPage,
});
export function SignInPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-[32px] font-semibold text-foreground">
          {t("auth.signIn.title")}
        </h1>
        <p className="text-muted-foreground">{t("auth.signIn.body")}</p>
      </div>
      <SignInForm />
    </>
  );
}
