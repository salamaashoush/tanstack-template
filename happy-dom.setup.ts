import "vitest-dom/extend-expect";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { setLanguageTag } from "~/i18n/runtime";

setLanguageTag("en");
afterEach(() => {
  cleanup();
});
