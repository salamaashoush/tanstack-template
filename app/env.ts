import * as v from "valibot";

const envSchema = v.object({
  NODE_ENV: v.optional(v.string(), "development"),
  VITE_API_URL: v.optional(v.string(), "https://api.tanstack.com"),

  // Auth
  VITE_SESSION_SECRET: v.string(),
  // Vite built-in variables
  MODE: v.optional(v.string(), "development"),
  BASE_URL: v.optional(v.string(), "/"),
  PROD: v.optional(v.boolean(), false),
  DEV: v.optional(v.boolean(), true),
  SSR: v.optional(v.boolean(), false),
});

export const env = v.parse(envSchema, import.meta.env);
