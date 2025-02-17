import { createServerFn } from "@tanstack/start";
import * as v from "valibot";
import { setResponseStatus } from "vinxi/http";

import type { LoginSchemaInput, RegisterSchemaOutput } from "~/schema/auth";
import type { AppSession } from "~/utils/session";
import { getUserService } from "~/api/index";
import { loginSchema, registerSchema } from "~/schema/auth";
import { getAppSession, isAuthenticatedGuard } from "~/utils/session";

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    // We need to auth on the server so we have access to secure cookies
    const session = await getAppSession();
    return session.data;
  },
);

export const login = createServerFn({ method: "POST" })
  .validator((payload: LoginSchemaInput) => v.parse(loginSchema, payload))
  .handler(async ({ data }) => {
    try {
      const session = await getAppSession();
      const user = await getUserService().login(data);
      const sessionData: AppSession = {
        isAuthenticated: true,
        user,
        accessToken: "fakeAccessToken",
      };
      await session.update(sessionData);
      return sessionData;
    } catch (error) {
      setResponseStatus(400);
      throw {
        message: (error as Error).message,
      };
    }
  });

export const register = createServerFn({ method: "POST" })
  .validator((payload: RegisterSchemaOutput) =>
    v.parse(registerSchema, payload),
  )
  .handler(async ({ data }) => {
    try {
      const session = await getAppSession();
      const user = await getUserService().register(data);
      const sessionData: AppSession = {
        isAuthenticated: true,
        user,
        accessToken: "fakeAccessToken",
      };
      await session.update(sessionData);
      return sessionData;
    } catch (error) {
      setResponseStatus(400);
      throw {
        message: (error as Error).message,
      };
    }
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAppSession();
  await session.clear();
});

export const getUserProfile = createServerFn({ method: "GET" }).handler(
  async () => {
    await isAuthenticatedGuard();
    try {
      return getUserService().getUserProfile();
    } catch (error) {
      setResponseStatus(400);
      throw {
        message: (error as Error).message,
      };
    }
  },
);
