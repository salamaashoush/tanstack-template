import "vitest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { setLocale } from "~/i18n/runtime";

setLocale("en");
afterEach(() => {
  cleanup();
});
