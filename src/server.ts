import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { env } from "~/env";
import { paraglideMiddleware } from "~/i18n/server";

// Fail fast. Validation is otherwise lazy, so a container started without
// SESSION_SECRET would boot, pass its healthcheck (which reads no config), have
// traffic routed to it, and only then 500 on every request. Better to never start.
void env.SESSION_SECRET;
void env.API_URL;

export default createServerEntry({
  fetch(request) {
    // Hand the ORIGINAL request to the handler, not the delocalized one the
    // middleware yields: TanStack Router does its own URL rewriting and the two
    // together produce a redirect loop.
    return paraglideMiddleware(request, () => handler.fetch(request));
  },
});
