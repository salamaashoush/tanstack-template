import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.session?.isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });
    } else {
      throw redirect({
        to: "/sign-in",
      });
    }
  },
});
