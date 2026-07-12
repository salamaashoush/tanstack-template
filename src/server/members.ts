import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { countMembersByStatus, findMember, queryMembers } from "~/data/members";
import { membersQuerySchema } from "~/schema/members";
import { isAuthenticatedGuard } from "~/utils/session";

export const listMembers = createServerFn({ method: "GET" })
  .validator((query: unknown) => v.parse(membersQuerySchema, query))
  .handler(async ({ data }) => {
    await isAuthenticatedGuard();
    // Filtering, sorting and paging happen here, not in the browser: the client
    // only ever receives the page it renders.
    return queryMembers(data);
  });

export const getMemberStats = createServerFn({ method: "GET" }).handler(
  async () => {
    await isAuthenticatedGuard();
    return countMembersByStatus();
  },
);

export const getMember = createServerFn({ method: "GET" })
  .validator((input: unknown) => v.parse(v.object({ id: v.string() }), input))
  .handler(async ({ data }) => {
    await isAuthenticatedGuard();
    const member = findMember(data.id);
    if (!member) {
      // Router-aware: the route renders its notFoundComponent instead of the
      // error boundary, and SSR responds 404 rather than 200.
      throw notFound();
    }
    return member;
  });
