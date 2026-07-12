import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deserialize, serialize } from "superjson";

import * as m from "~/i18n/messages";

import { getMessageFromError } from "./utils/error";

interface ServerFnErrorBody {
  result?: { message?: string };
  issues?: { message?: string }[];
  message?: string;
}

// Server function errors surface as an Error whose message is a JSON envelope.
// Unwrap it so the toast shows the underlying cause, not the envelope.
function unwrapServerFnMessage(message: string): string {
  let parsed: { body?: ServerFnErrorBody | string; message?: string };
  try {
    parsed = JSON.parse(message) as typeof parsed;
  } catch {
    return message;
  }

  const body = parsed.body;
  if (body === undefined) {
    return message;
  }
  if (typeof body === "string") {
    return body;
  }

  const issues = body.issues
    ?.map((issue) => issue.message)
    .filter((value): value is string => Boolean(value))
    .join(", ");

  return (
    body.result?.message ??
    (issues === undefined || issues === "" ? undefined : issues) ??
    body.message ??
    parsed.message ??
    message
  );
}

function onError(error: Error) {
  error.message = unwrapServerFnMessage(error.message);
  toast.error(m.notificationErrorTitle(), {
    description: getMessageFromError(error),
  });
}

export function createQueryClient(): QueryClient {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: serialize },
      hydrate: { deserializeData: deserialize },
      queries: {
        refetchOnReconnect: () => !queryClient.isMutating(),
      },
    },
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({
      onError,
      onSettled: () => {
        if (queryClient.isMutating() === 1) {
          return queryClient.invalidateQueries();
        }
        return undefined;
      },
    }),
  });

  return queryClient;
}
