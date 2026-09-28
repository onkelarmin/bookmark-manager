"use client";

import { FormInput } from "@/components/ui/form-input/form-input";
import styles from "../auth.module.scss";
import {
  ComponentProps,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearError } from "@/lib/utils/clear-error";
import { AUTH_INPUT_CONTRAINTS, ResetPasswordSchema } from "@/schemas/auth";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button/Button";
import { Spinner } from "@/components/ui/spinner/spinner";
import {
  SkeletonButton,
  SkeletonInput,
  SkeletonText,
} from "@/components/ui/skeleton/skeleton";
import { Heading } from "@/components/ui/heading/Heading";
import Link from "next/link";

export function ResetPasswordContent() {
  const searchParams = useSearchParams();

  if (searchParams.get("error") === "INVALID_TOKEN") return <InvalidToken />;

  const token = searchParams.get("token");
  if (token != null) return <ResetForm token={token} />;

  return <Fallback />;
}

function ResetForm({ token }: { token: string }) {
  type Errors = {
    root?: {
      code?: string;
      message?: string;
    };
    password?: string[];
    confirmPassword?: string[];
  };

  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const [errors, setErrors] = useState<Errors>({});
  const [isPending, setIsPending] = useState(false);

  //   Cleanup transient state
  useLayoutEffect(() => {
    return () => {
      setIsPending(false);
      setErrors({});
    };
  }, []);

  const passwordRef = useCallback((password: HTMLInputElement | null) => {
    return () => {
      if (password != null) password.value = "";
    };
  }, []);
  const confirmPasswordRef = useCallback(
    (password: HTMLInputElement | null) => {
      return () => {
        if (password != null) password.value = "";
      };
    },
    [],
  );

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    setIsPending(true);
    clearError(errors, setErrors, "root");

    if (formRef.current == null) return;

    const formData = new FormData(formRef.current);

    const result = ResetPasswordSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      const errors: Errors = {
        password: z.flattenError(result.error).fieldErrors.password,
        confirmPassword: z.flattenError(result.error).formErrors,
      };
      setErrors(errors);
      setIsPending(false);
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: result.data.password,
        token,
      });
      if (error) {
        setErrors({ root: { code: error.code, message: error.message } });
        return;
      }
      router.replace("/password-reset");
      formRef.current.reset();
    } catch {
      setErrors({
        root: {
          code: "PASSWORD_RESET_ERROR",
          message: "Something went wrong. Please try again.",
        },
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div>
        <Heading tag="h1" size="h1">
          Reset Your Password
        </Heading>
        <p className="mar-block-start-xs">
          Enter your new password below. Make sure it’s strong and secure.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className={styles.form}
        noValidate
      >
        <FormInput
          ref={passwordRef}
          type="password"
          name="password"
          label="New Password *"
          autoComplete="new-password"
          inputMode="text"
          minLength={AUTH_INPUT_CONTRAINTS.password.min}
          maxLength={AUTH_INPUT_CONTRAINTS.password.max}
          required
          disabled={isPending}
          onChange={() => clearError(errors, setErrors, "password")}
          errorMessage={errors?.password?.at(0)}
        />
        <FormInput
          ref={confirmPasswordRef}
          type="password"
          name="confirmPassword"
          label="Confirm Password *"
          autoComplete="new-password"
          inputMode="text"
          minLength={AUTH_INPUT_CONTRAINTS.password.min}
          maxLength={AUTH_INPUT_CONTRAINTS.password.max}
          required
          disabled={isPending}
          onChange={() => clearError(errors, setErrors, "confirmPassword")}
          errorMessage={errors?.confirmPassword?.at(0)}
        />
        <Button type="submit" variant="primary" fullWidth disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              <span className="mar-inline-start-xs">Resetting...</span>
            </>
          ) : (
            "Reset password"
          )}
        </Button>

        {errors?.root && (
          <p className={styles.error} role="alert">
            {errors.root.message}
          </p>
        )}
      </form>

      <div className={styles.links}>
        <Button As={Link} variant="link" href="/sign-in">
          Back to login
        </Button>
      </div>
    </>
  );
}

function InvalidToken() {
  return (
    <>
      <div>
        <Heading tag="h1" size="h1">
          Reset link expired or invalid
        </Heading>
        <p className="mar-block-start-xs">
          This password reset link is no longer valid. It may have expired or
          already been used. Please request a new password reset link to
          continue.
        </p>
      </div>

      <div className={styles.links}>
        <Button As={Link} variant="primary" fullWidth href="/forgot-password">
          Request a new reset link
        </Button>
      </div>
    </>
  );
}

function Fallback() {
  return (
    <>
      <div>
        <Heading tag="h1" size="h1">
          Invalid password reset link
        </Heading>
        <p className="mar-block-start-xs">
          This page can only be accessed using a password reset link. Please
          request a new link to reset your password.
        </p>
      </div>

      <div className={styles.links}>
        <Button As={Link} variant="primary" fullWidth href="/forgot-password">
          Request a new reset link
        </Button>
      </div>
    </>
  );
}

export function ResetPasswordContentSkeleton() {
  return (
    <>
      <div className={styles.form}>
        <div className="flow-xs">
          <SkeletonText fullWidth={false} />
          <SkeletonInput />
        </div>
        <div className="flow-xs">
          <SkeletonText fullWidth={false} />
          <SkeletonInput />
        </div>
        <SkeletonButton fullWidth />
      </div>
    </>
  );
}
