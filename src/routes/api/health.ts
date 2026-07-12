import { createFileRoute } from "@tanstack/react-router";

/**
 * Server route: an HTTP handler, not a page. Deliberately unauthenticated and
 * dependency-free so a container orchestrator can probe liveness without a
 * session, and so a failing upstream never marks the process itself unhealthy.
 */
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          { status: "ok", uptime: Math.round(process.uptime()) },
          { headers: { "cache-control": "no-store" } },
        ),
    },
  },
});
