import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CircleCheckBig,
  Clock,
  UserMinus,
  Users,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import * as m from "~/i18n/messages";
import { activityQuery } from "~/queries/activity";
import { memberStatsQuery } from "~/queries/members";
import { formatDateTime } from "~/utils/datetime";

export const Route = createFileRoute("/_authed/dashboard/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(memberStatsQuery),
      context.queryClient.ensureInfiniteQueryData(activityQuery),
    ]);
  },
  component: OverviewPage,
});

function OverviewPage() {
  const { data: stats } = useSuspenseQuery(memberStatsQuery);
  const { data: activity } = useInfiniteQuery(activityQuery);

  const recent = activity?.pages[0]?.events.slice(0, 6) ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          {m.overviewTitle()}
        </h1>
        <p className="text-muted-foreground">{m.overviewSubtitle()}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={m.overviewStatTotal()}
          value={stats.total}
          icon={<Users className="size-4" />}
        />
        <StatCard
          label={m.overviewStatActive()}
          value={stats.active}
          icon={<CircleCheckBig className="size-4" />}
        />
        <StatCard
          label={m.overviewStatInvited()}
          value={stats.invited}
          icon={<Clock className="size-4" />}
        />
        <StatCard
          label={m.overviewStatSuspended()}
          value={stats.suspended}
          icon={<UserMinus className="size-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{m.overviewRecentTitle()}</CardTitle>
          <CardDescription>{m.overviewRecentSubtitle()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {recent.map((event) => (
              <li
                key={event.id}
                className="flex items-center gap-4 py-3 first:pt-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    <span className="font-medium">{event.actor}</span>{" "}
                    {event.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(event.createdAt)}
                  </p>
                </div>
                <Badge variant="outline">{event.target}</Badge>
              </li>
            ))}
          </ul>

          <Button
            variant="link"
            className="mt-2 px-0"
            render={
              <Link to="/dashboard/activity">
                {m.overviewViewAllActivity()}
                <ArrowRight className="size-4" />
              </Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardDescription>{label}</CardDescription>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <p
          className="text-2xl font-semibold text-foreground"
          data-testid={`stat-${label}`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
