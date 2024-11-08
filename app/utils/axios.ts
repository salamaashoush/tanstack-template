import type { AxiosError, AxiosResponse } from "axios";
import { isAxiosError } from "axios";

import * as m from "~/i18n/messages";

interface HasMessage {
  message: string;
}
function hasMessage(data: unknown): data is HasMessage {
  return typeof data === "object" && data !== null && "message" in data;
}

export function getErrorMessageFromResponse(
  response: AxiosError | AxiosResponse,
): string {
  const data = (
    isAxiosError(response) ? response.response?.data : response.data
  ) as unknown;
  if (!hasMessage(data)) {
    return m.notificationErrorMessage();
  }
  return data.message;
}
