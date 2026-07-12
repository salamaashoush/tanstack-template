import { createFileRoute } from "@tanstack/react-router";

import { SignInForm } from "~/components/auth/SignInForm";
import * as m from "~/i18n/messages";

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInPage,
});
export function SignInPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-[32px] font-semibold text-foreground">
          {m.authSignInTitle()}
        </h1>
        <p className="text-muted-foreground">{m.authSignInBody()}</p>
      </div>
      <SignInForm />
    </>
  );
}
