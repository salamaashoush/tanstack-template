/// <reference types="vinxi/types/server" />
import { AsyncLocalStorage } from "node:async_hooks";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import type { Locale } from "~/i18n/runtime";
import { getLocale, setLocale } from "~/i18n/runtime";
import { createRouter } from "./router";

const langStorage = new AsyncLocalStorage<Locale>();

// ✅ when `languageTag` is called inside a route handler
// ✅ this function will return the language for the current request
setLocale(langStorage.getStore() ?? getLocale());

export default createStartHandler({
  createRouter,
  getRouterManifest,
})((ctx) => {
  const lang = getLocale();
  return langStorage.run(lang, async () => await defaultStreamHandler(ctx));
});
