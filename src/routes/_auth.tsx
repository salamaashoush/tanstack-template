import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AuthLayout } from "~/components/auth/AuthLayout";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (context.session?.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthHome,
});

function AuthHome() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
