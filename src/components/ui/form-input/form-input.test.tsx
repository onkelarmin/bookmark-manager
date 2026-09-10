import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormInput } from "./form-input";

describe("FormInput component", () => {
  it("renders an input of the correct type with the correct label", () => {
    render(<FormInput label="Email" name="email" type="email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("renders an error message", () => {
    render(
      <FormInput
        label="Email"
        name="email"
        type="email"
        errorMessage="Enter a valid email"
      />,
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a valid email");
  });
});
