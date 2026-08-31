"use client";

import { FormInput } from "@/components/ui/form-input/form-input";
import styles from "../auth.module.scss";
import { authClient } from "@/lib/auth-client";
import { AUTH_INPUT_CONTRAINTS, EmailSchema } from "@/schemas/auth";
import { useSearchParams } from "next/navigation";
import { ComponentProps, useRef, useState } from "react";
import z from "zod";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { useSessionStorage } from "@/app/hooks/useSessionStorage";
import { clearError } from "@/lib/utils/clear-error";

type Errors = {
  root?: string;
  email?: string[];
};

export function VerifyEmailContent() {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  const { getStoredValue, clearStorage } = useSessionStorage(
    "email",
    EmailSchema,
  );

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    if (formRef.current == null) return;

    setIsPending(true);
    setIsSuccess(false);
    clearError(errors, setErrors, "root");

    const result = z
      .object({ email: EmailSchema })
      .safeParse(emailRef.current?.value);
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      setIsPending(false);
      return;
    }

    try {
      const { error } = await authClient.sendVerificationEmail({
        email: result.data.email,
      });

      if (error) {
        setErrors({ root: error.message });
        return;
      }

      await authClient.sendVerificationEmail({ email: result.data.email });
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
      {source === "sign-up" ? (
        <p>
          Check your inbox for a verification link. It may take a minute to
          arrive.
        </p>
      ) : source === "sign-in" ? (
        <p>
          Your email address has not been verified yet. Send a new verification
          link to continue.
        </p>
      ) : (
        <p>
          Enter your email address and we’ll send a verification link if one is
          available.
        </p>
      )}
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
          label="Email"
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
        <Button
          type="submit"
          variant={source === "sign-up" ? "secondary" : "primary"}
          disabled={isPending}
          fullWidth
        >
          {isPending ? (
            <>
              <Spinner />
              <span className="mar-inline-start-xs">Sending...</span>
            </>
          ) : (
            <>{source === "sign-up" ? "Resend " : "Send "} verification email</>
          )}
        </Button>
      </form>
      {errors?.root && (
        <p className={styles.error} role="alert">
          {errors.root}
        </p>
      )}

      {isSuccess && (
        <p>If an eligible account exists, a verification link has been sent.</p>
      )}

      <Button
        As={Link}
        href="/sign-in"
        variant={source === "sign-up" ? "primary" : "secondary"}
        fullWidth
      >
        Back to log in
      </Button>
    </>
  );
}
