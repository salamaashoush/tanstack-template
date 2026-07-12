import { queryOptions } from "@tanstack/react-query";

import type { MembersQuery } from "~/schema/members";

import { getMember, getMemberStats, listMembers } from "~/server/members";

export function membersQuery(query: MembersQuery) {
  return queryOptions({
    // The full query is the key, so every distinct table state is cached
    // separately and going back to a previous page is instant.
    queryKey: ["members", query],
    queryFn: () => listMembers({ data: query }),
    // Keeps the previous page on screen while the next one loads, instead of
    // collapsing the table to a spinner on every sort or page change.
    placeholderData: (previous) => previous,
  });
}

export const memberStatsQuery = queryOptions({
  queryKey: ["members", "stats"],
  queryFn: () => getMemberStats(),
});

export function memberQuery(id: string) {
  return queryOptions({
    queryKey: ["members", "detail", id],
    queryFn: () => getMember({ data: { id } }),
  });
}
