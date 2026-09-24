import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ForgotPasswordContent } from "./forgot-password-content";
import userEvent from "@testing-library/user-event";
import { authClient } from "@/lib/auth-client";

vi.mock("@/lib/auth-client", () => {
  return {
    authClient: {
      requestPasswordReset: vi.fn(),
    },
  };
});

const requestPasswordResetMock = vi.mocked(authClient.requestPasswordReset);

describe("Forgot password flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the forgot password form", () => {
    render(<ForgotPasswordContent />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to login/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for invalid email input", async () => {
    const user = userEvent.setup();

    render(<ForgotPasswordContent />);

    await user.type(screen.getByLabelText(/email/i), "invalid email");

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(
      screen.getByText(/please enter a valid email address/i),
    ).toBeInTheDocument();
  });

  it("does not submit if validation fails", async () => {
    const user = userEvent.setup();

    render(<ForgotPasswordContent />);

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(authClient.requestPasswordReset).not.toHaveBeenCalled();
  });

  it("submits a valid email address and passes a redirect request to the reset-password page", async () => {
    requestPasswordResetMock.mockResolvedValueOnce({ data: {}, error: null });

    const user = userEvent.setup();

    const email = "valid@email.com";

    render(<ForgotPasswordContent />);

    await user.type(screen.getByLabelText(/email/i), email);

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(requestPasswordResetMock).toHaveBeenCalledWith({
      email,
      redirectTo: "/reset-password",
    });
  });

  it("shows the better auth error message", async () => {
    const errorMsg = "Something went wrong";

    requestPasswordResetMock.mockResolvedValueOnce({
      data: null,
      error: { message: errorMsg },
    });

    const user = userEvent.setup();

    const email = "valid@email.com";

    render(<ForgotPasswordContent />);

    await user.type(screen.getByLabelText(/email/i), email);

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("shows a general error message if submitting fails", async () => {
    requestPasswordResetMock.mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();

    const email = "valid@email.com";

    render(<ForgotPasswordContent />);

    await user.type(screen.getByLabelText(/email/i), email);

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(
      screen.getByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
  });

  it("shows pending state while submitting", async () => {
    requestPasswordResetMock.mockReturnValueOnce(new Promise(() => {}));

    const user = userEvent.setup();

    const email = "valid@email.com";

    render(<ForgotPasswordContent />);

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });

    await user.type(screen.getByLabelText(/email/i), email);

    await user.click(submitButton);

    expect(submitButton).toHaveTextContent("Sending...");
    expect(submitButton).toBeDisabled();
  });
});
