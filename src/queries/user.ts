import { queryOptions } from "@tanstack/react-query";

import { getUserProfile } from "~/server/auth";

export const getUserProfileQuery = queryOptions({
  queryKey: ["user", "profile"],
  queryFn: () => getUserProfile(),
});
