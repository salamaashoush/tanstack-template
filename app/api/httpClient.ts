import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

import type { AppSession } from "~/utils/session";
import { env } from "~/env";
import * as m from "~/i18n/messages";
import { getUserSession } from "~/server/auth.server";
import { getErrorMessageFromResponse } from "~/utils/axios";

export const httpClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let session: AppSession | undefined = undefined;
httpClient.interceptors.request.use(async (config) => {
  if (typeof session === "undefined") {
    session = await getUserSession();
  }
  // const token = session.token;
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (errorResponse) => {
    if (isAxiosError(errorResponse)) {
      if (errorResponse.response?.status == 401) {
        toast.error(m.authSessionExpiredTitle(), {
          description: m.authSessionExpiredMessage(),
        });

        // throw redirect({
        //   to: "/login",
        // });
      }
    }
    // errorToast(getErrorMessageFromResponse(errorResponse));
    toast.error(getErrorMessageFromResponse(errorResponse));
  },
);
