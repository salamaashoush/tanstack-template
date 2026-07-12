import { infiniteQueryOptions } from "@tanstack/react-query";

import { listActivity } from "~/server/activity";

export const activityQuery = infiniteQueryOptions({
  queryKey: ["activity"],
  queryFn: ({ pageParam }) => listActivity({ data: { cursor: pageParam } }),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
