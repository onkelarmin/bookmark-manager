import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResetPasswordContent } from "./reset-password-content";
import userEvent from "@testing-library/user-event";
import { authClient } from "@/lib/auth-client";

let searchParams: URLSearchParams;

const resetPasswordMock = vi.mocked(authClient.resetPassword);

const replaceMock = vi.fn();

describe("Reset password flow", () => {
  beforeEach(() => {
    searchParams = new URLSearchParams();

    vi.clearAllMocks();
  });

  it("renders the invalid token UI", () => {
    searchParams.set("error", "INVALID_TOKEN");

    render(<ResetPasswordContent />);

    expect(
      screen.getByRole("heading", { name: /reset link expired or invalid/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /request a new reset link/i }),
    ).toBeInTheDocument();
  });

  it("renders a fallback UI if no token is provided", () => {
    render(<ResetPasswordContent />);

    expect(
      screen.getByRole("heading", { name: /invalid password reset link/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /request a new reset link/i }),
    ).toBeInTheDocument();
  });

  it("renders the reset password form if a token is provided", () => {
    searchParams.set("token", "test-token");

    render(<ResetPasswordContent />);

    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to login/i }),
    ).toBeInTheDocument();
  });

  it("shows a validation error for an invalid pasword input", async () => {
    const user = userEvent.setup();

    searchParams.set("token", "test-token");

    render(<ResetPasswordContent />);

    await user.type(screen.getByLabelText(/new password/i), "invalid-password");

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(
      screen.getByText(
        "Must contain an uppercase, a lowercase, and a special character, and a number.",
      ),
    ).toBeInTheDocument();
  });

  it("shows a validation error if the passwords don't match", async () => {
    const user = userEvent.setup();

    searchParams.set("token", "test-token");

    const password1 = "Password123";
    const password2 = "Password1234";

    render(<ResetPasswordContent />);

    await user.type(screen.getByLabelText(/new password/i), password1);
    await user.type(screen.getByLabelText(/confirm password/i), password2);

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(screen.getByText("Passwords need to match")).toBeInTheDocument();
  });

  it("does not submit if the validation fails", async () => {
    const user = userEvent.setup();

    searchParams.set("token", "test-token");

    render(<ResetPasswordContent />);

    await user.type(screen.getByLabelText(/new password/i), "invalid-password");

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(resetPasswordMock).not.toHaveBeenCalled();
  });

  it("submits valid new password and redirects the user to the password-reset page", async () => {
    resetPasswordMock.mockResolvedValueOnce({ data: {}, error: null });

    const user = userEvent.setup();

    const token = "test-token";
    searchParams.set("token", token);

    const password1 = "Password123";
    const password2 = "Password123";

    render(<ResetPasswordContent />);

    await user.type(screen.getByLabelText(/new password/i), password1);
    await user.type(screen.getByLabelText(/confirm password/i), password2);

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(resetPasswordMock).toHaveBeenCalledWith({
      newPassword: password1,
      token,
    });
    expect(replaceMock).toHaveBeenCalledWith("/password-reset");
  });

  it("shows the better auth error message and does not redirect the user", async () => {
    const errorMsg = "Something went wrong";

    resetPasswordMock.mockResolvedValueOnce({
      data: null,
      error: { message: errorMsg },
    });

    const user = userEvent.setup();

    const token = "test-token";
    searchParams.set("token", token);

    const password1 = "Password123";
    const password2 = "Password123";

    render(<ResetPasswordContent />);

    await user.type(screen.getByLabelText(/new password/i), password1);
    await user.type(screen.getByLabelText(/confirm password/i), password2);

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("shows a general error message if submitting fails", async () => {
    resetPasswordMock.mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();

    const token = "test-token";
    searchParams.set("token", token);

    const password1 = "Password123";
    const password2 = "Password123";

    render(<ResetPasswordContent />);

    await user.type(screen.getByLabelText(/new password/i), password1);
    await user.type(screen.getByLabelText(/confirm password/i), password2);

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(
      screen.getByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("shows pending state while submitting", async () => {
    resetPasswordMock.mockReturnValueOnce(new Promise(() => {}));

    const user = userEvent.setup();

    const token = "test-token";
    searchParams.set("token", token);

    const password1 = "Password123";
    const password2 = "Password123";

    render(<ResetPasswordContent />);

    const submitButton = screen.getByRole("button", {
      name: /reset password/i,
    });

    await user.type(screen.getByLabelText(/new password/i), password1);
    await user.type(screen.getByLabelText(/confirm password/i), password2);

    await user.click(submitButton);

    expect(submitButton).toHaveTextContent("Resetting...");
    expect(submitButton).toBeDisabled();
  });
});

// Mocks

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParams,
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock("@/lib/auth-client", () => {
  return {
    authClient: {
      resetPassword: vi.fn(),
    },
  };
});
