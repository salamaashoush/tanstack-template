import type { ColumnDef } from "@tanstack/react-table";

import { Link } from "@tanstack/react-router";

import type { Member } from "~/data/seed";

import { StatusBadge } from "~/components/dashboard/StatusBadge";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import * as m from "~/i18n/messages";
import { formatRelativeDays } from "~/utils/datetime";
import { roleLabel } from "~/utils/memberLabels";

// Module scope, not inside the page: defining these during render remounts every
// cell on every keystroke of the search box.
export const memberColumns: ColumnDef<Member>[] = [
  {
    id: "select",
    size: 40,
    enableSorting: false,
    header: () => null,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
        aria-label={m.membersSelectRow({ name: row.original.name })}
      />
    ),
  },
  {
    accessorKey: "name",
    header: () => m.membersColumnName(),
    cell: ({ row }) => (
      <Link
        to="/dashboard/members/$memberId"
        params={{ memberId: row.original.id }}
        className="flex flex-col hover:underline"
      >
        <span className="font-medium text-foreground">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.email}
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "team",
    header: () => m.membersColumnTeam(),
    cell: ({ row }) => row.original.team,
  },
  {
    accessorKey: "role",
    header: () => m.membersColumnRole(),
    cell: ({ row }) => (
      <Badge variant="outline">{roleLabel(row.original.role)}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: () => m.membersColumnStatus(),
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "lastActiveAt",
    header: () => m.membersColumnLastActive(),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatRelativeDays(row.original.lastActiveAt)}
      </span>
    ),
  },
];
