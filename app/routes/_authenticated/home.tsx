import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { getUserProfileQuery } from "~/queries/user";
import { logout } from "~/server/auth.server";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

function HomePage() {
  const { data } = useQuery(getUserProfileQuery);
  const router = useRouter();
  return (
    <Card>
      <h1>Welcome back {data?.username}</h1>
      <Button
        onClick={async () => {
          await logout();
          await router.invalidate();
          router.navigate({ to: "/" });
        }}
      >
        Logout
      </Button>
    </Card>
  );
}
