import type { AxiosError, AxiosResponse } from "axios";
import { isAxiosError } from "axios";

import * as m from "~/i18n/messages";

interface HasMessage {
  message: string;
}
function hasMessage(data: unknown): data is HasMessage {
  return typeof data === "object" && data !== null && "message" in data;
}

export function getMessageFromError(
  error: AxiosError | AxiosResponse | unknown,
): string {
  const data = (
    isAxiosError(error)
      ? error.response?.data
      : typeof error === "object"
        ? error
        : error
  ) as unknown;

  if (hasMessage(data)) {
    return data.message;
  }
  return typeof data === "string" ? data : m.notificationErrorMessage();
}
