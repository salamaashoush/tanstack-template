import { setResponseStatus, useSession } from "vinxi/http";

import type { UserProfile } from "~/api/models";
import { env } from "~/env";

export interface AppSession {
  isAuthenticated: boolean;
  user: UserProfile;
  accessToken: string;
}

export function getAppSession() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<AppSession>({
    password: env.SESSION_SECRET,
  });
}

export async function getAccessTokenFromSession(): Promise<string> {
  const session = await getAppSession();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (session.data && session.data.isAuthenticated) {
    return session.data.accessToken;
  }
  return "";
}

export async function isAuthenticatedGuard() {
  const session = await getAppSession();
  // if (!session.data.accessToken || isJwtExpired(session.data.accessToken)) {
  if (!session.data.accessToken) {
    setResponseStatus(401);
    session.clear();
    throw {
      message: "Unauthorized",
    };
  }
}
