import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
    return context;
  },
  // loader: async ({ context }) => {
  //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  //   if (context.queryClient) {
  //     await context.queryClient.ensureQueryData(getUserProfileQuery);
  //   }
  //   return context;
  // },
});
