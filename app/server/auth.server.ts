import { createServerFn } from "@tanstack/start";
import * as v from "valibot";
import { setResponseStatus } from "vinxi/http";

import type { RegisterSchemaOutput } from "~/schema/auth";
import type { AppSession } from "~/utils/session";
import { getUserService } from "~/api/index";
import { loginSchema } from "~/schema/auth";
import { useAppSession } from "~/utils/session";

export const getUserSession = createServerFn("GET", async () => {
  // We need to auth on the server so we have access to secure cookies
  const session = await useAppSession();
  return session.data;
});

type LoginPayload = v.InferInput<typeof loginSchema>;
export const login = createServerFn("POST", async (payload: LoginPayload) => {
  try {
    const session = await useAppSession();
    const loginPayload = v.parse(loginSchema, payload);
    const user = await getUserService().login(loginPayload);
    const sessionData: AppSession = {
      isAuthenticated: true,
      user,
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

export const register = createServerFn(
  "POST",
  async (payload: RegisterSchemaOutput) => {
    try {
      const session = await useAppSession();
      const user = await getUserService().register(payload);
      const sessionData: AppSession = {
        isAuthenticated: true,
        user,
      };
      await session.update(sessionData);
      return sessionData;
    } catch (error) {
      setResponseStatus(400);
      throw {
        message: (error as Error).message,
      };
    }
  },
);

export const logout = createServerFn("POST", async () => {
  const session = await useAppSession();
  await session.clear();
});

export const getUserProfile = createServerFn("GET", async () => {
  try {
    return getUserService().getUserProfile();
  } catch (error) {
    setResponseStatus(400);
    throw {
      message: (error as Error).message,
    };
  }
});
