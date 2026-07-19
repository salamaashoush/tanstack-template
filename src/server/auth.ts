import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import * as v from "valibot";

import type { LoginSchemaInput, RegisterSchemaOutput } from "~/schema/auth";
import type { AppSession, AuthState } from "~/utils/session";

import { getUserService } from "~/api/index";
import { loginSchema, registerSchema } from "~/schema/auth";
import { getMessageFromError } from "~/utils/error";
import { isAuthenticatedGuard, useAppSession } from "~/utils/session";

// Router context is dehydrated into the SSR HTML, so this returns the auth
// flag alone -- never the access token or the profile held in the sealed cookie.
export const getAuthState = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthState> => {
    const session = await useAppSession();
    return { isAuthenticated: session.data.isAuthenticated === true };
  },
);

export const login = createServerFn({ method: "POST" })
  .validator((payload: LoginSchemaInput) => v.parse(loginSchema, payload))
  .handler(async ({ data }): Promise<AuthState> => {
    try {
      const session = await useAppSession();
      const user = await getUserService().login(data);
      const sessionData: AppSession = {
        isAuthenticated: true,
        user,
        accessToken: "fakeAccessToken",
      };
      await session.update(sessionData);
      return { isAuthenticated: true };
    } catch (error) {
      setResponseStatus(400);
      throw new Error(getMessageFromError(error), { cause: error });
    }
  });

export const register = createServerFn({ method: "POST" })
  .validator((payload: RegisterSchemaOutput) =>
    v.parse(registerSchema, payload),
  )
  .handler(async ({ data }): Promise<AuthState> => {
    try {
      const session = await useAppSession();
      const user = await getUserService().register(data);
      const sessionData: AppSession = {
        isAuthenticated: true,
        user,
        accessToken: "fakeAccessToken",
      };
      await session.update(sessionData);
      return { isAuthenticated: true };
    } catch (error) {
      setResponseStatus(400);
      throw new Error(getMessageFromError(error), { cause: error });
    }
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
});

export const getUserProfile = createServerFn({ method: "GET" }).handler(
  async () => {
    await isAuthenticatedGuard();
    try {
      return await getUserService().getUserProfile();
    } catch (error) {
      setResponseStatus(400);
      throw new Error(getMessageFromError(error), { cause: error });
    }
  },
);
