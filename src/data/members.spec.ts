import { describe, expect, it } from "vitest";

import type { MembersQuery } from "~/schema/members";

import { DEFAULT_MEMBERS_QUERY } from "~/schema/members";

import type { Member } from "./seed";

import { countMembersByStatus, queryMembers } from "./members";
import { MEMBERS } from "./seed";

function member(overrides: Partial<Member> = {}): Member {
  return {
    id: "mem_0001",
    name: "Ada Lovelace",
    email: "ada.lovelace@acme.test",
    team: "Platform",
    role: "admin",
    status: "active",
    lastActiveAt: "2026-06-01T00:00:00.000Z",
    ...overrides,
  };
}

const DATASET: Member[] = [
  member({
    id: "a",
    name: "Ada Lovelace",
    email: "ada.lovelace@acme.test",
    team: "Platform",
    role: "admin",
    status: "active",
  }),
  member({
    id: "b",
    name: "Grace Hopper",
    email: "grace.hopper@acme.test",
    team: "Security",
    role: "owner",
    status: "invited",
  }),
  member({
    id: "c",
    name: "Alan Turing",
    email: "alan.turing@acme.test",
    team: "Platform",
    role: "member",
    status: "suspended",
  }),
  member({
    id: "d",
    name: "Linus Torvalds",
    email: "linus.torvalds@acme.test",
    team: "Infrastructure",
    role: "viewer",
    status: "active",
  }),
];

function query(overrides: Partial<MembersQuery> = {}): MembersQuery {
  return { ...DEFAULT_MEMBERS_QUERY, ...overrides };
}

describe("queryMembers", () => {
  it("sorts by the requested field and direction", () => {
    const asc = queryMembers(query({ sort: "name", order: "asc" }), DATASET);
    expect(asc.rows.map((row) => row.name)).toEqual([
      "Ada Lovelace",
      "Alan Turing",
      "Grace Hopper",
      "Linus Torvalds",
    ]);

    const desc = queryMembers(query({ sort: "name", order: "desc" }), DATASET);
    expect(desc.rows.map((row) => row.name)).toEqual([
      "Linus Torvalds",
      "Grace Hopper",
      "Alan Turing",
      "Ada Lovelace",
    ]);
  });

  it("matches the search term against name, email and team", () => {
    expect(queryMembers(query({ q: "grace" }), DATASET).rows).toHaveLength(1);
    expect(
      queryMembers(query({ q: "ada.lovelace@acme.test" }), DATASET).rows,
    ).toHaveLength(1);

    const byTeam = queryMembers(query({ q: "platform" }), DATASET);
    expect(byTeam.rows.map((row) => row.id)).toEqual(["a", "c"]);
  });

  it("ignores case and surrounding whitespace in the search term", () => {
    expect(queryMembers(query({ q: "  GRACE  " }), DATASET).rows).toHaveLength(
      1,
    );
  });

  it("filters by role and status, combining them as AND", () => {
    expect(queryMembers(query({ role: "admin" }), DATASET).rows).toHaveLength(
      1,
    );
    expect(
      queryMembers(query({ status: "active" }), DATASET).rows,
    ).toHaveLength(2);
    expect(
      queryMembers(query({ role: "admin", status: "suspended" }), DATASET).rows,
    ).toHaveLength(0);
  });

  it("paginates and reports the total across all pages, not just the current one", () => {
    const first = queryMembers(query({ pageSize: 10, page: 1 }), DATASET);
    expect(first.rows).toHaveLength(4);
    expect(first.total).toBe(4);
    expect(first.pageCount).toBe(1);
  });

  it("clamps a page beyond the end instead of returning a blank table", () => {
    // Narrowing a filter while on page 9 must not strand the user on an empty page.
    const result = queryMembers(query({ page: 9, pageSize: 10 }), DATASET);
    expect(result.page).toBe(1);
    expect(result.rows).toHaveLength(4);
  });

  it("reports at least one page even when nothing matches", () => {
    const result = queryMembers(query({ q: "nobody" }), DATASET);
    expect(result.rows).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.pageCount).toBe(1);
  });

  it("does not mutate the dataset it is given", () => {
    const order = DATASET.map((row) => row.id);
    queryMembers(query({ sort: "name", order: "desc" }), DATASET);
    expect(DATASET.map((row) => row.id)).toEqual(order);
  });
});

describe("the seeded dataset", () => {
  it("gives every member a unique id, name and email", () => {
    // The email is derived from the name, so colliding names produced several
    // people sharing one address -- nonsense for a members table.
    expect(new Set(MEMBERS.map((row) => row.id)).size).toBe(MEMBERS.length);
    expect(new Set(MEMBERS.map((row) => row.name)).size).toBe(MEMBERS.length);
    expect(new Set(MEMBERS.map((row) => row.email)).size).toBe(MEMBERS.length);
  });

  it("is deterministic, so SSR and hydration agree", () => {
    expect(MEMBERS[0]?.id).toBe("mem_0001");
    expect(MEMBERS.at(-1)?.id).toBe(
      `mem_${String(MEMBERS.length).padStart(4, "0")}`,
    );
  });
});

describe("countMembersByStatus", () => {
  it("counts each status and the total", () => {
    expect(countMembersByStatus(DATASET)).toEqual({
      total: 4,
      active: 2,
      invited: 1,
      suspended: 1,
    });
  });

  it("returns zeroes for an empty dataset", () => {
    expect(countMembersByStatus([])).toEqual({
      total: 0,
      active: 0,
      invited: 0,
      suspended: 0,
    });
  });
});
