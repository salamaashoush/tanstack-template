import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import * as v from "valibot";

import type { LoginSchemaInput, RegisterSchemaOutput } from "~/schema/auth";
import type { AppSession } from "~/utils/session";

import { getUserService } from "~/api/index";
import { loginSchema, registerSchema } from "~/schema/auth";
import { getMessageFromError } from "~/utils/error";
import { isAuthenticatedGuard, useAppSession } from "~/utils/session";

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    // Read on the server so we have access to the sealed session cookie.
    const session = await useAppSession();
    return session.data;
  },
);

export const login = createServerFn({ method: "POST" })
  .validator((payload: LoginSchemaInput) => v.parse(loginSchema, payload))
  .handler(async ({ data }) => {
    try {
      const session = await useAppSession();
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
      throw new Error(getMessageFromError(error), { cause: error });
    }
  });

export const register = createServerFn({ method: "POST" })
  .validator((payload: RegisterSchemaOutput) =>
    v.parse(registerSchema, payload),
  )
  .handler(async ({ data }) => {
    try {
      const session = await useAppSession();
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
