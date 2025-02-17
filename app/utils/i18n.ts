import type { AvailableLanguageTag } from "~/i18n/runtime";
import { availableLanguageTags, sourceLanguageTag } from "~/i18n/runtime";
import { negotiateLanguagePreferences } from "./acceptHeader";

export const LOCAL_STORAGE_KEY = "language-tag";
export const COOKIE_KEY = "language-tag";

export function normalizeLocaleTag(tag: string) {
  return tag.toLowerCase().split(/[_-]+/)[0];
}

export async function setCookie(req: Request, name: string, value: string) {
  const cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=Strict`;
  req.headers.set("Set-Cookie", cookie);
}

export function getCookie(req: Request, name: string) {
  const cookies = req.headers.get("Cookie");
  if (!cookies) {
    return;
  }
  const cookie = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith(name));
  return cookie?.split("=")[1];
}

export const setLangCookie = async (req: Request, lang: string) => {
  return setCookie(req, COOKIE_KEY, lang);
};

export function getLanguageCookieFromRequest(req: Request) {
  return getCookie(req, COOKIE_KEY);
}

export function getLanguageFromHeaders(req: Request) {
  const acceptLanguage = req.headers.get("Accept-Language");
  const langs = negotiateLanguagePreferences(
    acceptLanguage,
    availableLanguageTags,
  );
  return langs[0];
}

export function detectLanguageFromRequest(
  req: Request,
  {
    forceLanguage,
    defaultLanguage = sourceLanguageTag,
  }: LanguageDetectorScriptConfig = {},
): AvailableLanguageTag {
  if (forceLanguage) {
    return forceLanguage;
  }
  const value =
    getLanguageCookieFromRequest(req) ?? getLanguageFromHeaders(req);
  if (!value) {
    return defaultLanguage as AvailableLanguageTag;
  }
  return normalizeLocaleTag(value) as AvailableLanguageTag;
}

export interface LanguageDetectorScriptConfig {
  forceLanguage?: AvailableLanguageTag;
  defaultLanguage?: AvailableLanguageTag;
  localStorageKey?: string;
  cookieKey?: string;
}

export function detectLanguageOnClient({
  defaultLanguage = sourceLanguageTag,
  localStorageKey = LOCAL_STORAGE_KEY,
  cookieKey = COOKIE_KEY,
  forceLanguage,
}: LanguageDetectorScriptConfig = {}): AvailableLanguageTag {
  if (forceLanguage) {
    return forceLanguage;
  }
  const language =
    localStorage.getItem(localStorageKey) ||
    (function () {
      const match = document.cookie.match(
        new RegExp("(^| )" + cookieKey + "=([^;]+)"),
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return match ? decodeURIComponent(match[2]!) : null;
    })() ||
    navigator.language ||
    defaultLanguage;
  return normalizeLocaleTag(language) as AvailableLanguageTag;
}

export function getLocaleDetectorScript({
  defaultLanguage = "ar",
  localStorageKey = "language-tag",
  cookieKey = "language-tag",
  forceLanguage,
}: LanguageDetectorScriptConfig) {
  return `
    (function() {
      function setLanguage(lang) {
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
        localStorage.setItem("${localStorageKey}", lang);
        document.cookie = "${cookieKey}=" + encodeURIComponent(lang) + "; path=/";
        console.log("set language", lang);
      }

      ${
        forceLanguage
          ? `setLanguage("${forceLanguage}");`
          : `
      try {
        var language = localStorage.getItem("${localStorageKey}") ||
                       (function() {
                         var match = document.cookie.match(new RegExp('(^| )${cookieKey}=([^;]+)'));
                         return match ? decodeURIComponent(match[2]) : null;
                       })() ||
                       navigator.language || navigator.userLanguage ||
                       "${defaultLanguage}";

        setLanguage(language.toLowerCase().split(/[_-]+/)[0]);
      } catch (e) {
        setLanguage("${defaultLanguage}");
      }`
      }
    })();
  `;
}
