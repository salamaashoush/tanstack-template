import type { SortingState } from "@tanstack/react-table";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import * as v from "valibot";

import type { MemberRole, MemberStatus } from "~/data/seed";
import type { MembersQuery } from "~/schema/members";

import { DataTable } from "~/components/data-table/DataTable";
import { DataTablePagination } from "~/components/data-table/DataTablePagination";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { MEMBER_ROLES, MEMBER_STATUSES } from "~/data/seed";
import * as m from "~/i18n/messages";
import { membersQuery } from "~/queries/members";
import { membersQuerySchema } from "~/schema/members";

import { memberColumns } from "./-columns";

const ALL = "all";

export const Route = createFileRoute("/_authed/dashboard/members/")({
  // The table's whole state lives in the URL: sorting, filters and paging are
  // shareable, survive a reload, and work with the back button.
  validateSearch: (search) => v.parse(membersQuerySchema, search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(membersQuery(deps)),
  component: MembersPage,
});

function MembersPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data, isPlaceholderData } = useQuery(membersQuery(search));
  const [selection, setSelection] = useState<Record<string, boolean>>({});

  const setSearch = useCallback(
    (next: Partial<MembersQuery>) => {
      void navigate({
        search: (prev) => ({ ...prev, ...next }),
        replace: true,
      });
    },
    [navigate],
  );

  const sorting: SortingState = useMemo(
    () => [{ id: search.sort, desc: search.order === "desc" }],
    [search.sort, search.order],
  );

  const handleSortingChange = useCallback(
    (next: SortingState) => {
      const first = next[0];
      if (!first) {
        return;
      }
      setSearch({
        sort: first.id as MembersQuery["sort"],
        order: first.desc ? "desc" : "asc",
        // A new sort order makes the current page number meaningless.
        page: 1,
      });
    },
    [setSearch],
  );

  const selectedCount = Object.values(selection).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          {m.membersTitle()}
        </h1>
        <p className="text-muted-foreground">{m.membersSubtitle()}</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          className="sm:max-w-xs"
          aria-label={m.membersSearchLabel()}
          placeholder={m.membersSearchPlaceholder()}
          // Controlled by the URL, so the box and the query cannot disagree --
          // including after a reload or a back navigation.
          value={search.q}
          onChange={(event) => setSearch({ q: event.target.value, page: 1 })}
        />

        <Select
          value={search.role ?? ALL}
          onValueChange={(value: string | null) =>
            setSearch({
              role: !value || value === ALL ? undefined : (value as MemberRole),
              page: 1,
            })
          }
        >
          <SelectTrigger className="sm:w-40" aria-label={m.membersFilterRole()}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{m.membersFilterAllRoles()}</SelectItem>
            {MEMBER_ROLES.map((role) => (
              <SelectItem key={role} value={role} className="capitalize">
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={search.status ?? ALL}
          onValueChange={(value: string | null) =>
            setSearch({
              status:
                !value || value === ALL ? undefined : (value as MemberStatus),
              page: 1,
            })
          }
        >
          <SelectTrigger
            className="sm:w-40"
            aria-label={m.membersFilterStatus()}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{m.membersFilterAllStatuses()}</SelectItem>
            {MEMBER_STATUSES.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={memberColumns}
        data={data?.rows ?? []}
        getRowId={(member) => member.id}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        isPending={isPlaceholderData}
        skeletonRows={search.pageSize}
        emptyState={
          <div className="text-center">
            <p className="font-medium text-foreground">
              {m.membersEmptyTitle()}
            </p>
            <p className="text-sm text-muted-foreground">
              {m.membersEmptyBody()}
            </p>
          </div>
        }
      />

      <DataTablePagination
        page={data?.page ?? 1}
        pageCount={data?.pageCount ?? 1}
        pageSize={search.pageSize}
        total={data?.total ?? 0}
        selectedCount={selectedCount}
        onPageChange={(page) => setSearch({ page })}
        onPageSizeChange={(pageSize) =>
          setSearch({ pageSize: pageSize as MembersQuery["pageSize"], page: 1 })
        }
      />
    </div>
  );
}
