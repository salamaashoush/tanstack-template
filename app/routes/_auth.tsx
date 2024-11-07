import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AuthLayout } from "~/components/auth/AuthLayout";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/dashboard",
        search: {
          redirect: location.href,
        },
      });
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
