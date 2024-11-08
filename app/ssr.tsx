/// <reference types="vinxi/types/server" />
import { getRouterManifest } from "@tanstack/start/router-manifest";
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/start/server";

import { setLanguageTag } from "./i18n/runtime";
import { createRouter } from "./router";
import { getLang } from "./utils/i18nSetup/server";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(async (ctx) => {
  const lang = await getLang(ctx.request, "en");
  setLanguageTag(lang);

  return defaultStreamHandler(ctx);
});
