import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { DashboardLayout } from "~/components/dashboard/DashboardLayout";
import { getUserProfileQuery } from "~/queries/user";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: ({ context, location }) => {
    if (!context.session?.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  loader: async ({ context }) => {
    if (context.session?.isAuthenticated) {
      await context.queryClient.ensureQueryData(getUserProfileQuery);
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
