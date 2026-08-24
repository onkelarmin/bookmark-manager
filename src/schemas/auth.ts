import z from "zod";

export const AUTH_INPUT_CONTRAINTS = {
  name: {
    max: 100,
  },
  email: {
    max: 256,
  },
  password: {
    min: 8,
    max: 100,
  },
};

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

const NameSchema = z.preprocess(
  emptyStringToUndefined,
  z
    .string("Please enter a valid username")
    .max(
      AUTH_INPUT_CONTRAINTS.name.max,
      `Please enter max. ${AUTH_INPUT_CONTRAINTS.name.max} characters`,
    ),
);

export const EmailSchema = z.preprocess(
  emptyStringToUndefined,
  z
    .email("Please enter a valid email address")
    .max(
      AUTH_INPUT_CONTRAINTS.email.max,
      `Please enter max. ${AUTH_INPUT_CONTRAINTS.email.max} characters`,
    ),
);

const PasswordSchema = z
  .string()
  .min(
    AUTH_INPUT_CONTRAINTS.password.min,
    `Password must be at least ${AUTH_INPUT_CONTRAINTS.password.min} characters long`,
  )
  .max(
    AUTH_INPUT_CONTRAINTS.password.max,
    `Password must be at least ${AUTH_INPUT_CONTRAINTS.password.max} characters long`,
  )
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    "Must contain an uppercase, a lowercase, and a special character, and a number.",
  );

export const SignUpSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});
