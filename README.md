# TanStack Start Template

A production-shaped starter: an admin console with server-driven tables, a virtualised
feed, sealed-cookie auth, and real internationalisation — not a hello-world.

Everything here is exercised end to end. The e2e suite builds and serves the
**production** bundle across Chromium, Firefox and WebKit.

## Stack

| Concern         | Choice                                                                          |
| --------------- | ------------------------------------------------------------------------------- |
| Framework       | [TanStack Start](https://tanstack.com/start) (Vite plugin, Nitro `node-server`) |
| Routing         | TanStack Router — file-based, type-safe, URL-as-state                           |
| Data            | TanStack Query, SSR-integrated; TanStack Table; TanStack Virtual                |
| Forms           | TanStack Form + Valibot (via Standard Schema — no resolver package)             |
| UI              | React 19, Tailwind v4, shadcn/ui on [Base UI](https://base-ui.com)              |
| i18n            | [Paraglide JS 2](https://paraglidejs.com) — compiled, tree-shaken, RTL          |
| Testing         | Vitest, Playwright                                                              |
| Lint / format   | [oxlint](https://oxc.rs) (type-aware) + [oxfmt](https://oxc.rs)                 |
| Package manager | [Bun](https://bun.com)                                                          |

## What it demonstrates

| Route                          |                                                                                                                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/dashboard`                   | Server-computed stats, recent activity                                                                                                                                                                    |
| `/dashboard/members`           | **TanStack Table** — sorting, filtering, pagination and row selection, all server-side. The table's entire state lives in the URL, so it is shareable, survives a reload, and works with the back button. |
| `/dashboard/members/$memberId` | Path params, a loader, a `pendingComponent`, and a server fn that throws `notFound()` — a bad id renders the not-found state and a real 404, not the error boundary.                                      |
| `/dashboard/activity`          | **TanStack Virtual** — 10,000 events over an infinite query; the DOM holds a window of rows, not the feed.                                                                                                |
| `/api/health`                  | A server route (an HTTP handler, not a page). Used by the container healthcheck.                                                                                                                          |

Plus: a pathless `_authed` layout that gates auth and owns the app chrome, sealed
encrypted-cookie sessions, and a locale switcher that re-renders the app in Arabic,
RTL, from the server.

## Prerequisites

- **Bun** — package manager and script runner.
- **Node.js 22+** — Vite, Vitest and Playwright execute on Node via their shebangs,
  and the production server is Node. Bun does not replace it.

> Bun is pinned to **canary**: `bun.lock` is `lockfileVersion 2`, which bun 1.3.x
> cannot parse. The Dockerfile and CI pin it to match.

## Getting started

```sh
bun install   # installs, compiles the messages, writes a .env with a fresh SESSION_SECRET
bun run dev   # http://localhost:3000
```

Sign in with `fake@fake.com` / `fake12345` — `src/api/services/user.service.ts` is an
in-memory fake. Swap it for a real API.

## Scripts

| Script                 |                                                      |
| ---------------------- | ---------------------------------------------------- |
| `bun run dev`          | Dev server on :3000                                  |
| `bun run build`        | Production build to `.output/`                       |
| `bun run start`        | Serve the production build                           |
| `bun run lint`         | oxlint (type-aware) + message-catalogue parity check |
| `bun run format:write` | oxfmt                                                |
| `bun run type-check`   | `tsc --noEmit`                                       |
| `bun run test`         | Vitest                                               |
| `bun run test:e2e`     | Playwright — builds and serves the production bundle |

Use `bun run test` / `bun run build`, **not** `bun test` / `bun build` — the bare forms
invoke Bun's own test runner and bundler instead of these scripts.

## Docker

Multi-stage: Bun installs, Node builds, and the runtime image carries only `.output`
(Nitro traces every runtime dependency into it, so there is no package manager and no
`node_modules` in the final image). Runs as a non-root user on Node 24 LTS, with a
healthcheck against `/api/health`.

```sh
docker build -t acme-console .

docker run -p 3000:3000 \
  -e API_URL="https://api.example.com" \
  -e SESSION_SECRET="$(openssl rand -base64 32)" \
  acme-console
```

Configuration comes from the environment — no `.env` is baked into the image.

A misconfigured container **refuses to start**. `src/server/preflight.ts` is a Nitro
plugin that validates the environment at server init and exits non-zero, so a missing
`SESSION_SECRET` crash-loops visibly instead of booting, passing its healthcheck and
then failing every request.

| Variable         |                                                                      |
| ---------------- | -------------------------------------------------------------------- |
| `SESSION_SECRET` | **Required.** Seals the session cookie. Use a 32+ byte random value. |
| `API_URL`        | **Required.** Upstream API base URL.                                 |
| `PORT` / `HOST`  | Default `3000` / `0.0.0.0`.                                          |

## Structure

```
src/
  routes/       file-based; _authed is a pathless auth+chrome layout
  server/       server functions (createServerFn)
  data/         pure, testable business logic + deterministic fixtures
  queries/      TanStack Query options
  schema/       Valibot schemas (also the URL search-param contracts)
  components/   ui/ is vendored shadcn — do not hand-edit
  i18n/         GENERATED by Paraglide — do not edit
messages/       source message catalogues (en, ar)
```

## Internationalisation

Messages live in `messages/{locale}.json` and compile to tree-shakeable functions:

```tsx
import * as m from "~/i18n/messages";
m.membersTitle();
```

Locale resolves **cookie → `Accept-Language` → base locale**. Switching writes the
cookie and reloads, so the next document is _server-rendered_ in the new locale with
the right `dir` — no half-translated client flash. Arabic lays out RTL throughout
(logical CSS properties only).

Adding a message to `en.json` without translating it in `ar.json` fails `bun run lint`.

## Working in this repo

Read **[AGENTS.md](./AGENTS.md)** — the conventions, the generated files you must not
edit, and the traps (Base UI is not Radix; `env.PROD` lies on the server; `*.server.ts`
is a denied filename). It is written for AI agents but it is the fastest orientation
for a human too.

## Notes for adopters

- The session cookie is named `start`. If you are migrating from a vinxi-era TanStack
  Start app, pass `name: 'h3'` to `useSession` or existing sessions are invalidated once.
- `Secure` on the session cookie is keyed to the request protocol, not the build mode —
  otherwise sign-in silently fails in Safari over plain http, including on localhost.
