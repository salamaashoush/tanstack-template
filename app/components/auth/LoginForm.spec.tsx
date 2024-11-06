import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { t } from "~/i18n/client";
import { render } from "~/testUtils";
import { LoginForm } from "./LoginForm";

vi.mock("@tanstack/react-router", () => ({
  useRouter: vi.fn(),
  Link: vi.fn(),
}));

vi.mock("~/server/auth.server", () => ({
  login: vi.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields", () => {
    render(<LoginForm />);

    expect(
      screen.getByLabelText(t("auth.login.form.email")),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(t("auth.login.form.password")),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("auth.login.form.submit") }),
    ).toBeInTheDocument();
    // expect(screen.getByText(t("auth.login.form.register"))).toBeInTheDocument();
  });
});
