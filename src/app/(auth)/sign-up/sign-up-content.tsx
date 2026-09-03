"use client";

import { ComponentProps, useLayoutEffect, useRef, useState } from "react";
import styles from "../auth.module.scss";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import {
  AUTH_INPUT_CONTRAINTS,
  EmailSchema,
  SignUpSchema,
} from "@/schemas/auth";
import { clearError } from "@/lib/utils/clear-error";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/ui/form-input/form-input";
import { Button } from "@/components/ui/button/Button";
import { Spinner } from "@/components/ui/spinner/spinner";
import Link from "next/link";

type Errors = {
  root?: string;
  name?: string[];
  email?: string[];
  password?: string[];
};

export function SignUpContent() {
  const formRef = useRef<HTMLFormElement>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [isPending, setIsPending] = useState(false);

  //   Cleanup transient state
  useLayoutEffect(() => {
    return () => {
      setIsPending(false);
      setErrors({});
    };
  }, []);

  const { setStorage } = useSessionStorage("email", EmailSchema);

  const router = useRouter();

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    setIsPending(true);
    clearError(errors, setErrors, "root");

    if (formRef.current == null) return;

    const formData = new FormData(formRef.current);

    const result = SignUpSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      setIsPending(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email(result.data);

      if (error) {
        setErrors({ root: error.message });

        return;
      }

      formRef.current.reset();

      setStorage(result.data.email);

      router.replace("/verify-email?source=sign-up");
    } catch {
      setErrors({ root: "Something went wrong. Please try again." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
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
          onChange={() => clearError(errors, setErrors, "name")}
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
          onChange={() => clearError(errors, setErrors, "email")}
          errorMessage={errors?.email?.at(0)}
        />
        <FormInput
          ref={(password) => {
            return () => {
              if (password != null) password.value = "";
            };
          }}
          type="password"
          name="password"
          label="Password *"
          autoComplete="new-password"
          inputMode="text"
          minLength={AUTH_INPUT_CONTRAINTS.password.min}
          maxLength={AUTH_INPUT_CONTRAINTS.password.max}
          required
          disabled={isPending}
          onChange={() => clearError(errors, setErrors, "password")}
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
    </>
  );
}
