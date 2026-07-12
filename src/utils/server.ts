import { setResponseStatus } from "@tanstack/react-start/server";

import { getMessageFromError, HttpError } from "./error";

export function errorResponse(error: unknown, code: number = 400) {
  if (error instanceof HttpError) {
    setResponseStatus(error.status);
    return error.data ?? { status: error.status, message: error.message };
  }

  setResponseStatus(code);
  return {
    status: code,
    message: getMessageFromError(error),
  };
}
