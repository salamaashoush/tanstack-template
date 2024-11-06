import { queryOptions } from "@tanstack/react-query";

import { getUserProfile } from "~/server/auth.server";

export const getUserProfileQuery = queryOptions({
  queryKey: ["user", "profile"],
  queryFn: () => getUserProfile(),
});
