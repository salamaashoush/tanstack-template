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

export const mobileNumberSchema = v.pipe(
  v.string(t("validation.required")),
  v.minLength(10, t("validation.minLength", { length: 10 })),
);

export const companySchema = v.pipe(
  v.string(t("validation.required")),
  v.minLength(2, t("validation.minLength", { length: 2 })),
);

export const jobTitleSchema = v.pipe(
  v.string(t("validation.required")),
  v.minLength(2, t("validation.minLength", { length: 2 })),
);
