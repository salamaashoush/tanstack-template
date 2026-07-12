import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import * as m from "~/i18n/messages";
import { memberQuery } from "~/queries/members";
import { DEFAULT_MEMBERS_QUERY } from "~/schema/members";
import { formatRelativeDays } from "~/utils/datetime";

export const Route = createFileRoute("/_authed/dashboard/members/$memberId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(memberQuery(params.memberId)),
  component: MemberDetailPage,
  pendingComponent: MemberDetailSkeleton,
  // The server fn throws notFound() for an unknown id, so a bad URL renders this
  // rather than the generic error boundary.
  notFoundComponent: MemberNotFound,
});

function BackToMembers() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ms-2.5 gap-1"
      render={
        <Link to="/dashboard/members" search={DEFAULT_MEMBERS_QUERY}>
          <ArrowLeft className="size-4" />
          {m.memberBackToMembers()}
        </Link>
      }
    />
  );
}

function MemberDetailPage() {
  const { memberId } = Route.useParams();
  const { data: member } = useSuspenseQuery(memberQuery(memberId));

  return (
    <div className="space-y-6">
      <BackToMembers />

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          {member.name}
        </h1>
        <p className="text-muted-foreground">{member.email}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{m.memberDetailsTitle()}</CardTitle>
          <CardDescription>{m.memberDetailsSubtitle()}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label={m.membersColumnTeam()}>{member.team}</Detail>
            <Detail label={m.membersColumnRole()}>
              <Badge variant="outline" className="capitalize">
                {member.role}
              </Badge>
            </Detail>
            <Detail label={m.membersColumnStatus()}>
              <Badge variant="outline" className="capitalize">
                {member.status}
              </Badge>
            </Detail>
            <Detail label={m.membersColumnLastActive()}>
              {formatRelativeDays(member.lastActiveAt)}
            </Detail>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}

function MemberDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-56 w-full" />
    </div>
  );
}

function MemberNotFound() {
  return (
    <div className="space-y-6">
      <BackToMembers />
      <div className="rounded-md border border-border p-8 text-center">
        <p className="font-medium text-foreground">{m.memberNotFoundTitle()}</p>
        <p className="text-sm text-muted-foreground">
          {m.memberNotFoundBody()}
        </p>
      </div>
    </div>
  );
}
