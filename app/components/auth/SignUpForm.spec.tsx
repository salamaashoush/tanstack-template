import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { t } from "~/i18n/client";
import { render } from "~/testUtils";
import { SignUpForm } from "./SignUpForm";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    navigate: mockNavigate,
    invalidate: vi.fn(),
  }),
}));

vi.mock("~/server/auth.server", () => ({
  register: vi.fn(),
}));

describe("SignUpForm", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });
  it("renders signup form correctly", async () => {
    render(<SignUpForm />);

    expect(
      screen.getByLabelText(t("auth.signUp.form.email")),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(t("auth.signUp.form.company")),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(t("auth.signUp.form.jobTitle")),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(t("auth.signUp.form.mobile")),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(t("auth.signUp.form.name")),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(t("auth.signUp.form.password")),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(t("auth.signUp.form.confirmPassword")),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("auth.signUp.form.submit") }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty form submission", async () => {
    render(<SignUpForm />);

    const submitButton = screen.getByRole("button", {
      name: t("auth.signUp.form.submit"),
    });
    await userEvent.click(submitButton);

    expect(await screen.findByText(t("validation.email"))).toBeInTheDocument();
    expect(
      (await screen.findAllByText(t("validation.minLength", { length: 2 })))
        .length,
    ).toBe(2);
    expect(
      await screen.findByText(t("validation.minLength", { length: 10 })),
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(t("auth.signUp.form.email"));
    const nameInput = screen.getByLabelText(t("auth.signUp.form.name"));
    const mobileInput = screen.getByLabelText(t("auth.signUp.form.mobile"));
    const companyInput = screen.getByLabelText(t("auth.signUp.form.company"));
    const jobTitleInput = screen.getByLabelText(t("auth.signUp.form.jobTitle"));
    const passwordInput = screen.getByLabelText(t("auth.signUp.form.password"));
    const confirmPasswordInput = screen.getByLabelText(
      t("auth.signUp.form.confirmPassword"),
    );

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(mobileInput, "1234567890");
    await userEvent.type(companyInput, "Test Company");
    await userEvent.type(jobTitleInput, "Developer");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    const submitButton = screen.getByRole("button", {
      name: t("auth.signUp.form.submit"),
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(t("validation.email"))).not.toBeInTheDocument();
      expect(
        screen.queryByText(t("validation.minLength", { length: 2 })),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(t("validation.minLength", { length: 10 })),
      ).not.toBeInTheDocument();
    });
  });

  it("calls toggle function when login link is clicked", async () => {
    render(<SignUpForm />);

    const loginLink = screen.getByRole("button", {
      name: t("auth.signUp.form.signIn"),
    });
    await userEvent.click(loginLink);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("validates email format", async () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(t("auth.signUp.form.email"));
    await userEvent.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", {
      name: t("auth.signUp.form.submit"),
    });
    await userEvent.click(submitButton);

    expect(await screen.findByText(t("validation.email"))).toBeInTheDocument();
  });
});
