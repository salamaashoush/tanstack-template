import { useQuery } from "@tanstack/react-query";

import { getUserProfileQuery } from "~/queries/user";

export function useUserProfile() {
  return useQuery(getUserProfileQuery);
}
