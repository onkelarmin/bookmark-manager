"use client";

import styles from "../auth.module.scss";
import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import { FormInput } from "@/components/ui/form-input/form-input";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { AUTH_INPUT_CONTRAINTS, SignUpSchema } from "@/schemas/auth";
import { ComponentProps, useRef, useState } from "react";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner/spinner";

type Errors = {
  root?: string;
  name?: string[];
  email?: string[];
  password?: string[];
};

export default function SignUpPage() {
  const [errors, setErrors] = useState<Errors>({});

  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const clearError = (name: keyof Errors) => {
    if (errors[name] == null) return;

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    setIsPending(true);
    clearError("root");

    if (formRef.current == null) return;

    const formData = new FormData(formRef.current);

    const result = SignUpSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    try {
      const { error } = await authClient.signUp.email(result.data);

      if (error) {
        setErrors({ root: error.message });

        return;
      }

      router.push("/");
      formRef.current.reset();
    } catch {
      setErrors({ root: "Something went wrong. Please try again." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthFormShell>
      <div>
        <Heading tag="h1" size="h1">
          Create your account
        </Heading>
        <p className="mar-block-start-xs">
          Join us and start saving your favorite links — organized, searchable,
          and always within reach.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className={styles.form}
        noValidate
      >
        <FormInput
          type="text"
          name="name"
          label="Username *"
          autoComplete="name"
          inputMode="text"
          maxLength={AUTH_INPUT_CONTRAINTS.name.max}
          required
          disabled={isPending}
          onChange={() => clearError("name")}
          errorMessage={errors?.name?.at(0)}
        />
        <FormInput
          type="email"
          name="email"
          label="Email *"
          autoComplete="email"
          inputMode="email"
          maxLength={AUTH_INPUT_CONTRAINTS.email.max}
          required
          disabled={isPending}
          onChange={() => clearError("email")}
          errorMessage={errors?.email?.at(0)}
        />
        <FormInput
          type="password"
          name="password"
          label="Password *"
          autoComplete="new-password"
          inputMode="text"
          minLength={AUTH_INPUT_CONTRAINTS.password.min}
          maxLength={AUTH_INPUT_CONTRAINTS.password.max}
          required
          disabled={isPending}
          onChange={() => clearError("password")}
          errorMessage={errors?.password?.at(0)}
        />
        <Button type="submit" variant="primary" fullWidth disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              <span className="mar-inline-start-xs">Creating...</span>
            </>
          ) : (
            "Create account"
          )}
        </Button>
        {errors?.root && (
          <p className={styles.error} role="alert">
            {errors.root}
          </p>
        )}
      </form>

      <div className={styles.links}>
        {/* Log in */}
        <div className={styles.link}>
          <p>Already have an account?</p>
          <Button As={Link} variant="link" href="/sign-in">
            Log in
          </Button>
        </div>
      </div>
    </AuthFormShell>
  );
}
