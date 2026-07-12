import type { CompilerOptions } from "@inlang/paraglide-js";

// Shared by vite.config.ts and scripts/compile-i18n.ts. The `paraglide-js compile`
// CLI has no --cookie-name flag, so a CLI-based compile would silently emit a
// runtime using the default PARAGLIDE_LOCALE cookie and diverge from the build.
export const paraglideOptions = {
  project: "./project.inlang",
  outdir: "./src/i18n",
  outputStructure: "message-modules",
  strategy: ["cookie", "preferredLanguage", "baseLocale"],
  cookieName: "language-tag",
} satisfies CompilerOptions;
