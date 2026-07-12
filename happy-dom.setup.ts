import "vitest-dom/extend-expect";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { overwriteGetLocale } from "~/i18n/runtime";

overwriteGetLocale(() => "en");

afterEach(() => {
  cleanup();
});
