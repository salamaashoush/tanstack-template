/// <reference types="vinxi/types/server" />
import { AsyncLocalStorage } from "node:async_hooks";
import { getRouterManifest } from "@tanstack/start/router-manifest";
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/start/server";

import type { AvailableLanguageTag } from "~/i18n/runtime";
import { setLanguageTag, sourceLanguageTag } from "~/i18n/runtime";
import { createRouter } from "./router";
import { detectLanguageFromRequest } from "./utils/i18n";

const langStorage = new AsyncLocalStorage<AvailableLanguageTag>();

// ✅ when `languageTag` is called inside a route handler
// ✅ this function will return the language for the current request
setLanguageTag(() => {
  return langStorage.getStore() ?? sourceLanguageTag;
});

export default createStartHandler({
  createRouter,
  getRouterManifest,
})((ctx) => {
  const lang = detectLanguageFromRequest(ctx.request, {});
  return langStorage.run(lang, async () => await defaultStreamHandler(ctx));
});
