import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as m from "~/i18n/messages";
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

    expect(screen.getByLabelText(m.authSignUpFormEmail())).toBeInTheDocument();
    expect(
      screen.getByLabelText(m.authSignUpFormCompany()),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(m.authSignUpFormJobTitle()),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(m.authSignUpFormMobile())).toBeInTheDocument();
    expect(screen.getByLabelText(m.authSignUpFormName())).toBeInTheDocument();
    expect(
      screen.getByLabelText(m.authSignUpFormPassword()),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(m.authSignUpFormConfirmPassword()),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: m.authSignUpFormSubmit() }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty form submission", async () => {
    render(<SignUpForm />);

    const submitButton = screen.getByRole("button", {
      name: m.authSignUpFormSubmit(),
    });
    await userEvent.click(submitButton);

    expect(await screen.findByText(m.validationEmail())).toBeInTheDocument();
    expect(
      (await screen.findAllByText(m.validationMinLength({ count: 2 }))).length,
    ).toBe(2);
    expect(
      await screen.findByText(m.validationMinLength({ count: 10 })),
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(m.authSignUpFormEmail());
    const nameInput = screen.getByLabelText(m.authSignUpFormName());
    const mobileInput = screen.getByLabelText(m.authSignUpFormMobile());
    const companyInput = screen.getByLabelText(m.authSignUpFormCompany());
    const jobTitleInput = screen.getByLabelText(m.authSignUpFormJobTitle());
    const passwordInput = screen.getByLabelText(m.authSignUpFormPassword());
    const confirmPasswordInput = screen.getByLabelText(
      m.authSignUpFormConfirmPassword(),
    );

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(mobileInput, "1234567890");
    await userEvent.type(companyInput, "Test Company");
    await userEvent.type(jobTitleInput, "Developer");
    await userEvent.type(passwordInput, "password123");
    await userEvent.type(confirmPasswordInput, "password123");

    const submitButton = screen.getByRole("button", {
      name: m.authSignUpFormSubmit(),
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(m.validationEmail())).not.toBeInTheDocument();
      expect(
        screen.queryByText(m.validationMinLength({ count: 2 })),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(m.validationMinLength({ count: 10 })),
      ).not.toBeInTheDocument();
    });
  });

  it("calls toggle function when login link is clicked", async () => {
    render(<SignUpForm />);

    const loginLink = screen.getByRole("button", {
      name: m.authSignUpFormSignIn(),
    });
    await userEvent.click(loginLink);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("validates email format", async () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(m.authSignUpFormEmail());
    await userEvent.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", {
      name: m.authSignUpFormSubmit(),
    });
    await userEvent.click(submitButton);

    expect(await screen.findByText(m.validationEmail())).toBeInTheDocument();
  });
});
