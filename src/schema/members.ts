import * as v from "valibot";

import { MEMBER_ROLES, MEMBER_STATUSES } from "~/data/seed";

export const MEMBER_SORT_FIELDS = [
  "name",
  "team",
  "role",
  "status",
  "lastActiveAt",
] as const;

export const MEMBERS_PAGE_SIZES = [10, 25, 50] as const;

/**
 * Also the URL search-param contract for /dashboard/members, so every field is
 * optional with a default: a bare /dashboard/members must be valid.
 */
export const membersQuerySchema = v.object({
  page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
  pageSize: v.optional(v.picklist(MEMBERS_PAGE_SIZES), 10),
  sort: v.optional(v.picklist(MEMBER_SORT_FIELDS), "name"),
  order: v.optional(v.picklist(["asc", "desc"]), "asc"),
  q: v.optional(v.string(), ""),
  role: v.optional(v.picklist(MEMBER_ROLES)),
  status: v.optional(v.picklist(MEMBER_STATUSES)),
});

export type MembersQuery = v.InferOutput<typeof membersQuerySchema>;

/**
 * Every default, materialised. Navigating to the members route requires a
 * complete search object, so callers elsewhere spread this and override only
 * what they care about.
 */
export const DEFAULT_MEMBERS_QUERY: MembersQuery = v.parse(
  membersQuerySchema,
  {},
);
