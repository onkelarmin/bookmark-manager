import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { VerifyEmailContent } from "./verify-email-content";
import userEvent from "@testing-library/user-event";
import { authClient } from "@/lib/auth-client";

let searchParams: URLSearchParams;

const sendVerificationEmailMock = vi.mocked(authClient.sendVerificationEmail);

describe("Verify email flow", () => {
  beforeEach(() => {
    searchParams = new URLSearchParams();

    vi.clearAllMocks();
  });

  it("renders the verify email form", () => {
    render(<VerifyEmailContent />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send verification email/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to log in/i }),
    ).toBeInTheDocument();
  });

  it("prefills the email if a valid one is stored", () => {
    const email = "valid@email.com";
    sessionStorage.setItem("email", JSON.stringify(email));

    render(<VerifyEmailContent />);

    expect(screen.getByLabelText(/email/i)).toHaveValue(email);
  });

  it("shows a validation error for an invalid email input", async () => {
    const user = userEvent.setup();

    render(<VerifyEmailContent />);

    await user.type(screen.getByLabelText(/email/i), "invalid-email");

    await user.click(
      screen.getByRole("button", { name: /send verification email/i }),
    );

    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });

  it("does not submit if the validation fails", async () => {
    const user = userEvent.setup();

    render(<VerifyEmailContent />);

    await user.click(
      screen.getByRole("button", { name: /send verification email/i }),
    );

    expect(sendVerificationEmailMock).not.toHaveBeenCalled();
  });

  it("submits a valid email address and passes the email-verified page as callbackURL", async () => {
    const email = "valid@email.com";

    const user = userEvent.setup();

    render(<VerifyEmailContent />);

    await user.type(screen.getByLabelText(/email/i), email);

    await user.click(
      screen.getByRole("button", { name: /send verification email/i }),
    );

    expect(sendVerificationEmailMock).toHaveBeenCalledWith({
      email,
      callbackURL: "/email-verified",
    });
  });

  it("shows the better auth error message", async () => {
    const errorMsg = "Something went wrong";

    sendVerificationEmailMock.mockResolvedValueOnce({
      data: null,
      error: { message: errorMsg },
    });

    const user = userEvent.setup();

    render(<VerifyEmailContent />);

    const email = "valid@email.com";

    await user.type(screen.getByLabelText(/email/i), email);

    await user.click(
      screen.getByRole("button", { name: /send verification email/i }),
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("shows a general error message if submitting fails", async () => {
    sendVerificationEmailMock.mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();

    render(<VerifyEmailContent />);

    const email = "valid@email.com";

    await user.type(screen.getByLabelText(/email/i), email);

    await user.click(
      screen.getByRole("button", { name: /send verification email/i }),
    );

    expect(
      screen.getByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
  });

  it("shows pending state while submitting", async () => {
    sendVerificationEmailMock.mockReturnValueOnce(new Promise(() => {}));

    const user = userEvent.setup();

    render(<VerifyEmailContent />);

    const email = "valid@email.com";
    const submitButton = screen.getByRole("button", {
      name: /send verification email/i,
    });

    await user.type(screen.getByLabelText(/email/i), email);

    await user.click(submitButton);

    expect(submitButton).toHaveTextContent("Sending...");
    expect(submitButton).toBeDisabled();
  });
});

// Mocks
vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParams,
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    sendVerificationEmail: vi.fn(),
  },
}));
