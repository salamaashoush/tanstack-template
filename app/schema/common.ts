import * as v from "valibot";

import { t } from "~/i18n/client";

export const emailSchema = v.pipe(
  v.string(t("validation.required")),
  v.email(t("validation.email")),
);

export const passwordSchema = v.pipe(
  v.string(t("validation.required")),
  v.minLength(8, t("validation.minLength", { length: 8 })),
);

export const usernameSchema = v.pipe(
  v.string(t("validation.required")),
  v.minLength(3, t("validation.minLength", { length: 3 })),
);
