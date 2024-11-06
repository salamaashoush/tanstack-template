import type { AxiosError, AxiosResponse } from "axios";
import { isAxiosError } from "axios";

import { t } from "~/i18n/client";

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
    return t("notifications.error.message");
  }
  return data.message;
}
