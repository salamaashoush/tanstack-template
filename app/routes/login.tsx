import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginForm } from "~/components/auth/LoginForm";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    console.log("context", context);
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/home",
      });
    }
  },
  component: LoginPage,
});
export function LoginPage() {
  return <LoginForm />;
}
