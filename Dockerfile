# syntax=docker/dockerfile:1

# Node 24 is the active LTS (26 does not become LTS until Oct 2026).
ARG NODE_VERSION=24.18.0

# ---------------------------------------------------------------------------
# deps: install with bun (it owns the lockfile), but on a Node base image --
# vite and the TanStack Start plugin execute on Node via their shebangs, so
# both runtimes are needed to build.
#
# bun is pinned to canary: bun.lock is lockfileVersion 2, which bun 1.3.x
# cannot parse. Keep this in step with .github/setup/action.yml.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS deps
ENV CI=true
WORKDIR /app

# Take the binary straight from the official image rather than curl-installing:
# one fewer network fetch, and the tag pins the build.
COPY --from=oven/bun:canary /usr/local/bin/bun /usr/local/bin/bun

# Everything the postinstall hook touches: it compiles the message catalogues,
# so paraglide's config and the messages must be present before the install.
COPY package.json bun.lock bunfig.toml .npmrc paraglide.options.ts ./
COPY project.inlang ./project.inlang
COPY messages ./messages
COPY scripts ./scripts
COPY .husky ./.husky

# CI=true makes the prepare script skip husky, which wants a .git that is not here.
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ---------------------------------------------------------------------------
# build: produce .output (Nitro node-server preset)
# ---------------------------------------------------------------------------
FROM deps AS build
WORKDIR /app

COPY . .

# `bun run build` shells out through `--env-file=.env`, so the file must exist.
# The values are irrelevant: nothing here is baked into the bundle (src/env.ts
# reads the environment at runtime) and this stage is discarded.
RUN cp .env.example .env && bun run build

# ---------------------------------------------------------------------------
# runtime: Nitro traces every runtime dependency into .output, so this image
# needs no package manager, no node_modules and no source.
#
# alpine is safe here only because .output is pure JavaScript -- it contains no
# .node binaries, which would be glibc-linked and break against musl. Re-check
# that if you ever add a dependency with a native addon.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Drop privileges. The `node` user ships with the base image.
COPY --from=build --chown=node:node /app/.output ./.output
USER node

EXPOSE 3000

# Unauthenticated server route -- see src/routes/api/health.ts.
#
# This also catches misconfiguration. src/server.ts reads the required env at
# module load, so a container started without SESSION_SECRET serves 500s rather
# than booting a broken app: the probe fails and no traffic is routed to it.
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Exec form: node is PID 1 and gets SIGTERM directly, so it shuts down cleanly
# instead of being killed once the grace period expires.
CMD ["node", ".output/server/index.mjs"]
