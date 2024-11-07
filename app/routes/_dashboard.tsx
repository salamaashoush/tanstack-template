import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { DashboardLayout } from "~/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
    return context;
  },
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
