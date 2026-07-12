import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Replaces `inlang lint`, removed in @inlang/cli v3 with no successor.
import settings from "../project.inlang/settings.json" with { type: "json" };

const MESSAGES_DIR = join(import.meta.dirname, "..", "messages");

async function readKeys(locale: string): Promise<Set<string>> {
  const raw = await readFile(join(MESSAGES_DIR, `${locale}.json`), "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null) {
    throw new TypeError(`messages/${locale}.json is not an object`);
  }
  return new Set(Object.keys(parsed).filter((key) => key !== "$schema"));
}

const { baseLocale, locales } = settings;
const targets = locales.filter((locale) => locale !== baseLocale);

const baseKeys = await readKeys(baseLocale);
const targetEntries = await Promise.all(
  targets.map(async (locale) => [locale, await readKeys(locale)] as const),
);

const problems = targetEntries.flatMap(([locale, keys]) => {
  const missing = [...baseKeys]
    .filter((key) => !keys.has(key))
    .toSorted()
    .map((key) => `${locale}: missing translation for "${key}"`);
  const extra = [...keys]
    .filter((key) => !baseKeys.has(key))
    .toSorted()
    .map((key) => `${locale}: "${key}" has no counterpart in ${baseLocale}`);
  return missing.concat(extra);
});

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(problem);
  }
  process.exit(1);
}

console.log(
  `i18n: ${String(baseKeys.size)} messages, ${String(locales.length)} locales, all in sync`,
);
