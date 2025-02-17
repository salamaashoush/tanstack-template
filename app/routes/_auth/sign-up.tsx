import { createFileRoute } from "@tanstack/react-router";

import { SignUpForm } from "~/components/auth/SignUpForm";
import * as m from "~/i18n/messages";

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUpPage,
});

export default function SignUpPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-[32px] font-semibold">
          {m.authSignUpTitle()}
        </h1>
        <p className="text-muted-foreground">{m.authSignUpBody()}</p>
      </div>
      <SignUpForm />
    </>
  );
}
