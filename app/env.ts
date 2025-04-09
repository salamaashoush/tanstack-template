import * as v from "valibot";
import { createEnv } from "valibot-env";

export const env = createEnv({
  publicPrefix: "VITE_",
  schema: {
    private: {
      API_URL: v.string(),
      SESSION_SECRET: v.string(),
    },
    shared: {
      NODE_ENV: v.optional(
        v.union([v.literal("development"), v.literal("production")]),
        "development",
      ),
      // vite env
      MODE: v.optional(v.string(), "development"),
      BASE_URL: v.optional(v.string(), "/"),
      PROD: v.optional(v.boolean(), false),
      DEV: v.optional(v.boolean(), true),
      SSR: v.optional(v.boolean(), false),
    },
  },
  values: {
    // eslint-disable-next-line no-restricted-properties
    ...process.env,
    ...import.meta.env,
  },
});
