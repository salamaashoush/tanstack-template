import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { DashboardLayout } from "~/components/dashboard/DashboardLayout";
import { getUserProfileQuery } from "~/queries/user";
import { queryClient } from "~/queryClient";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async ({ context, location }) => {
    if (!context.session?.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
    return context;
  },
  loader: async ({ context }) => {
    if (context.session?.isAuthenticated) {
      // Load user data
      await queryClient.ensureQueryData(getUserProfileQuery);
    }
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
