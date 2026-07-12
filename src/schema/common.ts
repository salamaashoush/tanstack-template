import * as v from "valibot";

import * as m from "~/i18n/messages";

export const emailSchema = v.pipe(
  v.string(m.validationRequired()),
  v.email(m.validationEmail()),
);

export const passwordSchema = v.pipe(
  v.string(m.validationRequired()),
  v.minLength(8, m.validationMinLength({ count: 8 })),
);

export const usernameSchema = v.pipe(
  v.string(m.validationRequired()),
  v.minLength(3, m.validationMinLength({ count: 3 })),
);

export const mobileNumberSchema = v.pipe(
  v.string(m.validationRequired()),
  v.minLength(10, m.validationMinLength({ count: 10 })),
);

export const companySchema = v.pipe(
  v.string(m.validationRequired()),
  v.minLength(2, m.validationMinLength({ count: 2 })),
);

export const jobTitleSchema = v.pipe(
  v.string(m.validationRequired()),
  v.minLength(2, m.validationMinLength({ count: 2 })),
);
