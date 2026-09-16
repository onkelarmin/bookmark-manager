import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignUpContent } from "./sign-up-content";
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
      signUp: {
        email: vi.fn(),
      },
    },
  };
});

const signUpEmailMock = vi.mocked(authClient.signUp.email);

describe("Sign up flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("render the sign up form", () => {
    render(<SignUpContent />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows validation errors for invalid inputs", async () => {
    const user = userEvent.setup();

    render(<SignUpContent />);

    await user.type(screen.getByLabelText(/email/i), "invalid email");
    await user.type(screen.getByLabelText(/password/i), "invalid-password");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      screen.getByText(/please enter a valid username/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/please enter a valid email address/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Must contain an uppercase, a lowercase, and a special character, and a number.",
      ),
    ).toBeInTheDocument();
  });

  it("does not submit when validation fails", async () => {
    const user = userEvent.setup();

    render(<SignUpContent />);

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(authClient.signUp.email).not.toHaveBeenCalled();
  });

  it("submits valid details", async () => {
    signUpEmailMock.mockResolvedValueOnce({ data: {}, error: null });

    const user = userEvent.setup();

    const name = "valid user";
    const email = "valid@email.com";
    const password = "ValidPassword123";

    render(<SignUpContent />);

    await user.type(screen.getByLabelText(/username/i), name);
    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/password/i), password);

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(authClient.signUp.email).toHaveBeenCalledWith({
      name,
      email,
      password,
    });
    expect(replaceMock).toHaveBeenCalledWith("/verify-email?source=sign-up");
  });

  it("shows the better auth error message when submitting fails", async () => {
    const errorMsg = "Something went wrong";

    signUpEmailMock.mockResolvedValueOnce({
      data: null,
      error: { message: errorMsg },
    });

    const user = userEvent.setup();

    const name = "valid user";
    const email = "valid@email.com";
    const password = "ValidPassword123";

    render(<SignUpContent />);

    await user.type(screen.getByLabelText(/username/i), name);
    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/password/i), password);

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("shows a general error message if submitting fails", async () => {
    signUpEmailMock.mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();

    const name = "valid user";
    const email = "valid@email.com";
    const password = "ValidPassword123";

    render(<SignUpContent />);

    await user.type(screen.getByLabelText(/username/i), name);
    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/password/i), password);

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      screen.getByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
