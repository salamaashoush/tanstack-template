import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as m from "~/i18n/messages";
import { render } from "~/testUtils";
import { SignInForm } from "./SignInForm";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    navigate: mockNavigate,
    invalidate: vi.fn(),
  }),
}));

vi.mock("~/server/auth.server", () => ({
  login: vi.fn(),
}));

describe("SignForm", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders SignInForm form correctly", () => {
    render(<SignInForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty form submission", async () => {
    render(<SignInForm />);

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(m.validationEmail())).toBeInTheDocument();
    expect(
      await screen.findByText(m.validationMinLength({ count: 8 })),
    ).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/please enter a valid email/i),
    ).toBeInTheDocument();
  });

  it("shows validation error for short password", async () => {
    render(<SignInForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, "12345");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(m.validationMinLength({ count: 8 })),
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(m.validationEmail())).not.toBeInTheDocument();
      expect(
        screen.queryByText(m.validationMinLength({ count: 8 })),
      ).not.toBeInTheDocument();
    });
  });

  it("calls toggle function when signup link is clicked", async () => {
    render(<SignInForm />);

    const signupLink = screen.getByRole("button", { name: /sign up/i });
    await userEvent.click(signupLink);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
