import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignInContent } from "./sign-in-content";
import userEvent from "@testing-library/user-event";
import { authClient } from "@/lib/auth-client";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock("@/lib/auth-client", () => {
  return {
    authClient: {
      signIn: {
        email: vi.fn(),
      },
    },
  };
});

const signInEmailMock = vi.mocked(authClient.signIn.email);

describe("Sign in flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the sign in form", () => {
    render(<SignInContent />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  it("shows validation errors for invalid email input", async () => {
    const user = userEvent.setup();

    render(<SignInContent />);

    await user.type(screen.getByLabelText(/email/i), "invalid email");

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      screen.getByText(/please enter a valid email address/i),
    ).toBeInTheDocument();
  });

  it("does not submit if validation fails", async () => {
    const user = userEvent.setup();

    render(<SignInContent />);

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(authClient.signIn.email).not.toHaveBeenCalled();
  });

  it("submits valid details and redirects user to the home page", async () => {
    signInEmailMock.mockResolvedValueOnce({ data: {}, error: null });

    const user = userEvent.setup();

    const email = "valid@email.com";
    const password = "Password123";

    render(<SignInContent />);

    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/password/i), password);

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(authClient.signIn.email).toHaveBeenCalledWith({
      email,
      password,
    });
    expect(replaceMock).toHaveBeenCalledWith("/");
  });

  it("shows the better auth error message and does not redirect the user", async () => {
    const errorMsg = "Something went wrong";

    signInEmailMock.mockResolvedValueOnce({
      data: null,
      error: { message: errorMsg },
    });

    const user = userEvent.setup();

    const email = "valid@email.com";
    const password = "Password123";

    render(<SignInContent />);

    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/password/i), password);

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("shows a general error message if submitting fails", async () => {
    signInEmailMock.mockRejectedValue(new Error("Network error"));

    const user = userEvent.setup();

    const email = "valid@email.com";
    const password = "Password123";

    render(<SignInContent />);

    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/password/i), password);

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      screen.getByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
