import "i18next";

import type translation from "./i18n/locales/en/translation.json";
import type { defaultNS } from "./i18n/settings";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: defaultNS;
    resources: {
      translation: typeof translation;
    };
  }
}
