"use client";

import styles from "../auth.module.scss";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { Button } from "@/components/ui/button/Button";
import { FormInput } from "@/components/ui/form-input/form-input";
import { Spinner } from "@/components/ui/spinner/spinner";
import { authClient } from "@/lib/auth-client";
import { clearError } from "@/lib/utils/clear-error";
import { AUTH_INPUT_CONTRAINTS, EmailSchema } from "@/schemas/auth";
import Link from "next/link";
import {
  ComponentProps,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import z from "zod";

type Errors = {
  root?: string;
  email?: string[];
};

export function ForgotPasswordContent() {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  //   Prepopulate email
  const { getStoredValue, clearStorage } = useSessionStorage(
    "email",
    EmailSchema,
  );

  useEffect(() => {
    const email = getStoredValue();

    if (email != null && emailRef.current != null) {
      emailRef.current.value = email;
      clearStorage();
    }
  }, [getStoredValue, clearStorage]);

  //   Cleanup transient state
  useLayoutEffect(() => {
    return () => {
      setIsSuccess(false);
      setIsPending(false);
      setErrors({});
    };
  }, []);

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    if (formRef.current == null) return;

    setIsPending(true);
    setIsSuccess(false);
    clearError(errors, setErrors, "root");

    const result = z
      .object({ email: EmailSchema })
      .safeParse({ email: emailRef.current?.value });
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      setIsPending(false);
      return;
    }

    try {
      const { error } = await authClient.requestPasswordReset({
        email: result.data.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setErrors({ root: error.message });
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrors({
        root: "Something went wrong. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate
      >
        <FormInput
          ref={emailRef}
          type="email"
          name="email"
          label="Email *"
          autoComplete="email"
          inputMode="email"
          maxLength={AUTH_INPUT_CONTRAINTS.email.max}
          required
          disabled={isPending}
          onChange={() => {
            clearError(errors, setErrors, "email");
            setIsSuccess(false);
          }}
          errorMessage={errors?.email?.at(0)}
        />
        <Button type="submit" variant="primary" disabled={isPending} fullWidth>
          {isPending ? (
            <>
              <Spinner />
              <span className="mar-inline-start-xs">Sending...</span>
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      {errors?.root && (
        <p className={styles.error} role="alert">
          {errors.root}
        </p>
      )}

      {isSuccess && (
        <p>If an eligible account exists, a reset link has been sent.</p>
      )}

      <div className={styles.links}>
        {/* Log in */}
        <div className={styles.link}>
          <Button As={Link} variant="link" href="/sign-in">
            Back to login
          </Button>
        </div>
      </div>
    </>
  );
}
