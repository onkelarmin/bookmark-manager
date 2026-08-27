"use client";

import styles from "../auth.module.scss";
import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { ComponentProps, useRef, useState } from "react";
import { FormInput } from "@/components/ui/form-input/form-input";
import { AUTH_INPUT_CONTRAINTS, VerifyEmailSchema } from "@/schemas/auth";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import {
  useVerificationContext,
  VerificationContext,
} from "@/app/hooks/useVerificationContext";
import {
  SkeletonButton,
  SkeletonInput,
  SkeletonText,
} from "@/components/ui/skeleton/skeleton";
import { Spinner } from "@/components/ui/spinner/spinner";

type Errors = {
  root?: string;
  email?: string[];
};

export default function VerifyEmailPage() {
  const { verificationContext } = useVerificationContext();

  return (
    <AuthFormShell>
      <div className="flow-lg">
        <Heading tag="h1" size="h1">
          Verify your email
        </Heading>

        {verificationContext === undefined ? (
          <VerificationSkeleton />
        ) : (
          <VerifyEmailContent
            key={
              verificationContext
                ? `${verificationContext.source}:${verificationContext.email}`
                : "no-context"
            }
            verificationContext={verificationContext}
          />
        )}
      </div>
    </AuthFormShell>
  );
}

function VerifyEmailContent({
  verificationContext,
}: {
  verificationContext: VerificationContext;
}) {
  const [email, setEmail] = useState(() => verificationContext?.email ?? "");

  const [isPending, setIsPending] = useState(false);

  const [errors, setErrors] = useState<Errors>({});

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

    if (formRef.current == null) return;

    setIsPending(true);
    clearError("root");

    const result = VerifyEmailSchema.safeParse({ email });
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

      authClient.sendVerificationEmail({ email: result.data.email });
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
      {verificationContext?.source === "sign-up" && (
        <p>
          Check your inbox for a verification link. It may take a minute to
          arrive.
        </p>
      )}
      {verificationContext?.source === "sign-in" && (
        <p>
          Your email address has not been verified yet. Send a new verification
          link to continue.
        </p>
      )}
      {verificationContext == null && (
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
          type="email"
          name="email"
          label="Email"
          autoComplete="email"
          inputMode="email"
          maxLength={AUTH_INPUT_CONTRAINTS.email.max}
          required
          disabled={isPending}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError("email");
          }}
          errorMessage={errors?.email?.at(0)}
        />
        <Button
          type="submit"
          variant={
            verificationContext?.source === "sign-up" ? "secondary" : "primary"
          }
          disabled={isPending}
          fullWidth
        >
          {isPending ? (
            <>
              <Spinner />
              <span className="mar-inline-start-xs">Sending...</span>
            </>
          ) : (
            <>
              {verificationContext?.source === "sign-up" ? "Resend " : "Send "}{" "}
              verification email
            </>
          )}
        </Button>
      </form>

      <Button
        As={Link}
        href="/sign-in"
        variant={
          verificationContext?.source === "sign-up" ? "primary" : "secondary"
        }
        fullWidth
      >
        Back to log in
      </Button>
    </>
  );
}

function VerificationSkeleton() {
  return (
    <>
      <div className="flow-xs">
        <SkeletonText />
        <SkeletonText />
      </div>
      <div className={styles.form}>
        <SkeletonText fullWidth={false} />
        <SkeletonInput />
        <SkeletonButton fullWidth />
      </div>
    </>
  );
}
