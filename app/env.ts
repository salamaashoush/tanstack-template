import * as v from "valibot";

// Define server-only schema
const serverEnvSchema = v.object({
  NODE_ENV: v.optional(v.string(), "development"),
  API_URL: v.string(),
  SESSION_SECRET: v.string(),
});

// Define client schema
const viteEnvSchema = v.object({
  MODE: v.optional(v.string(), "development"),
  BASE_URL: v.optional(v.string(), "/"),
  PROD: v.optional(v.boolean(), false),
  DEV: v.optional(v.boolean(), true),
  SSR: v.optional(v.boolean(), false),
});

// Validate and parse environment variables
const parsedServerEnv =
  // eslint-disable-next-line no-restricted-properties
  import.meta.env.SSR ? v.parse(serverEnvSchema, process.env) : {};
const parsedClientEnv = v.parse(viteEnvSchema, import.meta.env);

type ParsedServerEnv = v.InferOutput<typeof serverEnvSchema>;
type ParsedClientEnv = v.InferOutput<typeof viteEnvSchema>;
type ParsedEnv = ParsedServerEnv & ParsedClientEnv;

// Merge parsed environments, with server env hidden from client
export const env = new Proxy(
  import.meta.env.SSR
    ? { ...parsedClientEnv, ...parsedServerEnv }
    : parsedClientEnv,
  {
    get(target, prop) {
      if (prop in parsedServerEnv && typeof window !== "undefined") {
        throw new Error(
          `Access to server-only environment variable '${String(prop)}' from client code is not allowed.`,
        );
      }
      return prop in parsedServerEnv
        ? parsedServerEnv[prop as keyof typeof parsedServerEnv]
        : target[prop as keyof typeof parsedClientEnv];
    },
  },
) as ParsedEnv;
