import { setResponseStatus, useSession } from "@tanstack/react-start/server";

import type { UserProfile } from "~/api/models";

import { env } from "~/env";

export interface AppSession {
  isAuthenticated: boolean;
  user: UserProfile;
  accessToken: string;
}

export function useAppSession() {
  return useSession<AppSession>({
    password: env.SESSION_SECRET,
  });
}

export async function getAccessTokenFromSession(): Promise<string> {
  const session = await useAppSession();
  if (session.data.isAuthenticated && session.data.accessToken) {
    return session.data.accessToken;
  }
  return "";
}

export async function isAuthenticatedGuard() {
  const session = await useAppSession();
  if (!session.data.accessToken) {
    setResponseStatus(401);
    await session.clear();
    throw new Error("Unauthorized");
  }
}
