import type { MembersQuery } from "~/schema/members";

import type { Member } from "./seed";

import { MEMBERS } from "./seed";

export interface MembersPage {
  rows: Member[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface MemberStats {
  total: number;
  active: number;
  invited: number;
  suspended: number;
}

export function findMember(
  id: string,
  dataset: Member[] = MEMBERS,
): Member | undefined {
  return dataset.find((member) => member.id === id);
}

export function countMembersByStatus(dataset: Member[] = MEMBERS): MemberStats {
  const stats: MemberStats = {
    total: 0,
    active: 0,
    invited: 0,
    suspended: 0,
  };
  for (const member of dataset) {
    stats.total += 1;
    stats[member.status] += 1;
  }
  return stats;
}

function matches(member: Member, query: MembersQuery): boolean {
  if (query.role && member.role !== query.role) {
    return false;
  }
  if (query.status && member.status !== query.status) {
    return false;
  }

  const term = query.q.trim().toLowerCase();
  if (term === "") {
    return true;
  }
  return (
    member.name.toLowerCase().includes(term) ||
    member.email.toLowerCase().includes(term) ||
    member.team.toLowerCase().includes(term)
  );
}

function compare(a: Member, b: Member, query: MembersQuery): number {
  const left = a[query.sort];
  const right = b[query.sort];
  // Every sortable field is a string, including the ISO timestamp, which sorts
  // chronologically under a lexicographic compare.
  const result = left.localeCompare(right);
  return query.order === "asc" ? result : -result;
}

/**
 * Pure: the dataset is a parameter so this is testable without a server.
 * Clamps `page` into range rather than returning an empty page, so narrowing a
 * filter while on a high page number cannot strand the user on a blank table.
 */
export function queryMembers(
  query: MembersQuery,
  dataset: Member[] = MEMBERS,
): MembersPage {
  const filtered = dataset.filter((member) => matches(member, query));
  const sorted = filtered.toSorted((a, b) => compare(a, b, query));

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, pageCount);
  const start = (page - 1) * query.pageSize;

  return {
    rows: sorted.slice(start, start + query.pageSize),
    total,
    page,
    pageSize: query.pageSize,
    pageCount,
  };
}
