import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AuthLayout } from "~/components/auth/AuthLayout";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context }) => {
    if (context.session?.isAuthenticated) {
      throw redirect({ to: "/" });
    }
    return context;
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
