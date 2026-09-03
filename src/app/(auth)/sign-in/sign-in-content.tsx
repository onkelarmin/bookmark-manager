"use client";

import { ComponentProps, useLayoutEffect, useRef, useState } from "react";
import styles from "../auth.module.scss";
import { useRouter } from "next/navigation";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { Button } from "@/components/ui/button/Button";
import { FormInput } from "@/components/ui/form-input/form-input";
import { Spinner } from "@/components/ui/spinner/spinner";
import { authClient } from "@/lib/auth-client";
import { clearError } from "@/lib/utils/clear-error";
import {
  EmailSchema,
  SignInSchema,
  AUTH_INPUT_CONTRAINTS,
} from "@/schemas/auth";
import Link from "next/link";
import z from "zod";

type Errors = {
  root?: {
    code?: string;
    message?: string;
  };
  email?: string[];
  password?: string[];
};

export function SignInContent() {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [isPending, setIsPending] = useState(false);

  //   Cleanup transient state
  useLayoutEffect(() => {
    return () => {
      setIsPending(false);
      setErrors({});
    };
  }, []);

  const router = useRouter();

  const emailStorage = useSessionStorage("email", EmailSchema);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    setIsPending(true);
    clearError(errors, setErrors, "root");

    if (formRef.current == null) return;

    const formData = new FormData(formRef.current);

    const result = SignInSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      setIsPending(false);
      return;
    }

    try {
      const { error } = await authClient.signIn.email(result.data);

      if (error) {
        setErrors({ root: { code: error.code, message: error.message } });

        return;
      }

      router.replace("/");
      formRef.current.reset();
    } catch {
      setErrors({
        root: {
          code: "SIGN_IN_ERROR",
          message: "Something went wrong. Please try again.",
        },
      });
    } finally {
      setIsPending(false);
    }
  };

  const setEmailStorage = () => {
    const email = emailRef.current?.value;
    if (email == null) return;

    emailStorage.setStorage(email);
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
          ref={emailRef}
          type="email"
          name="email"
          label="Email"
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
          label="Password"
          autoComplete="current-password"
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
              <span className="mar-inline-start-xs">Logging in...</span>
            </>
          ) : (
            "Log in"
          )}
        </Button>

        {errors?.root && (
          <p className={styles.error} role="alert">
            {errors.root.message}
          </p>
        )}
        {errors?.root?.code === "EMAIL_NOT_VERIFIED" && (
          <Button
            As={Link}
            variant="link"
            href="/verify-email?source=sign-in"
            onClick={setEmailStorage}
            fullWidth
          >
            Resend verification email
          </Button>
        )}
      </form>

      <div className={styles.links}>
        {/* Reset */}
        <div className={styles.link}>
          <p>Forgot password?</p>
          <Button
            As={Link}
            variant="link"
            href="/forgot-password"
            onClick={setEmailStorage}
          >
            Reset
          </Button>
        </div>

        {/* Sign up */}
        <div className={styles.link}>
          <p>Don’t have an account?</p>
          <Button As={Link} variant="link" href="/sign-up">
            Sign up
          </Button>
        </div>
      </div>
    </>
  );
}
