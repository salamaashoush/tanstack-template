import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import superjson from "superjson";

import * as m from "~/i18n/messages";
import { getMessageFromError } from "./utils/error";

function onError(error: Error) {
  if (typeof error.message === "string") {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.body) {
        error.message =
          typeof parsed.body === "string"
            ? parsed.body
            : (parsed.body?.result?.message ??
              parsed.body?.issues
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ?.map((m: any) => m?.message)
                .filter(Boolean)
                .join(", ") ??
              parsed.body?.message ??
              parsed.message ??
              error.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // noop
    }
  }
  toast.error(m.notificationErrorTitle(), {
    description: getMessageFromError(error),
  });
}

export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    dehydrate: { serializeData: superjson.serialize },
    hydrate: { deserializeData: superjson.deserialize },

    queries: {
      refetchOnReconnect: () => !queryClient.isMutating(),
    },
  },
  queryCache: new QueryCache({
    onError,
  }),
  mutationCache: new MutationCache({
    onError,
    onSettled: () => {
      if (queryClient.isMutating() === 1) {
        return queryClient.invalidateQueries();
      }
    },
  }),
});
