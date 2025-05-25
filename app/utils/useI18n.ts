import { useEffect, useState } from "react";

import type { Locale } from "~/i18n/runtime";
import { getLocale, locales, setLocale } from "~/i18n/runtime";

export function useI18n() {
  const [currentLanguage, setCurrentLanguage] = useState<Locale>("ar");
  const [dir, setDir] = useState<"ltr" | "rtl">("rtl");
  useEffect(() => {
    const locale = getLocale();
    setCurrentLanguage(locale);
    setDir(locale === "ar" ? "rtl" : "ltr");
  }, []);

  const setLanguage = (locale: Locale) => {
    setCurrentLanguage(locale);
    setDir(locale === "ar" ? "rtl" : "ltr");
    setLocale(locale);
  };

  return {
    currentLanguage,
    dir,
    setLanguage,
    locales,
  };
}
