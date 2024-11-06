import { useSession } from "vinxi/http";

import type { UserProfile } from "~/api/services/user.service";
import { env } from "~/env";

export interface AppSession {
  isAuthenticated: boolean;
  user: UserProfile;
}

export function useAppSession() {
  return useSession<AppSession>({
    password: env.VITE_SESSION_SECRET,
  });
}
