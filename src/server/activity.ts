import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { queryActivity } from "~/data/activity";
import { isAuthenticatedGuard } from "~/utils/session";

const cursorSchema = v.object({
  cursor: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)), 0),
});

export const listActivity = createServerFn({ method: "GET" })
  .validator((input: unknown) => v.parse(cursorSchema, input))
  .handler(async ({ data }) => {
    await isAuthenticatedGuard();
    return queryActivity(data.cursor);
  });
