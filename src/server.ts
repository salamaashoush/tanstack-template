import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { paraglideMiddleware } from "~/i18n/server";

export default createServerEntry({
  fetch(request) {
    // Hand the ORIGINAL request to the handler, not the delocalized one the
    // middleware yields: TanStack Router does its own URL rewriting and the two
    // together produce a redirect loop.
    return paraglideMiddleware(request, () => handler.fetch(request));
  },
});
