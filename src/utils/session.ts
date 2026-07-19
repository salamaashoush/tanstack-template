import {
  getRequestProtocol,
  setResponseStatus,
  useSession,
} from "@tanstack/react-start/server";

import type { UserProfile } from "~/api/models";

import { env } from "~/env";

export interface AppSession {
  isAuthenticated: boolean;
  user: UserProfile;
  accessToken: string;
}

// The client-safe projection of AppSession. Anything placed in router context
// ends up in the SSR payload, so only this shape may cross that boundary.
export interface AuthState {
  isAuthenticated: boolean;
}

export function useAppSession() {
  return useSession<AppSession>({
    password: env.SESSION_SECRET,
    cookie: {
      // Keyed off the actual request protocol, not the build mode: the default
      // (`secure: true`) makes WebKit drop the cookie on any http:// origin, so
      // sign-in fails outright in Safari against a dev server or a plain-http
      // preview. xForwardedProto keeps this correct behind a TLS-terminating
      // proxy, where the origin request arrives as http.
      secure: getRequestProtocol({ xForwardedProto: true }) === "https",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
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
