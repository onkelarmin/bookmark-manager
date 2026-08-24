import styles from "../auth.module.scss";
import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import { FormInput } from "@/components/ui/form-input/form-input";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";
import { AUTH_INPUT_CONTRAINTS } from "@/schemas/auth";

export default function SignInPage() {
  return (
    <AuthFormShell>
      <div>
        <Heading tag="h1" size="h1">
          Log in to your account
        </Heading>
        <p className="mar-block-start-xs">
          Welcome back! Please enter your details.
        </p>
      </div>

      <form className={styles.form} noValidate>
        <FormInput
          type="email"
          name="email"
          label="Email"
          autoComplete="email"
          inputMode="email"
          maxLength={AUTH_INPUT_CONTRAINTS.email.max}
          required
        />
        <FormInput
          type="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          inputMode="text"
          minLength={AUTH_INPUT_CONTRAINTS.password.min}
          maxLength={AUTH_INPUT_CONTRAINTS.password.max}
          required
        />
        <Button type="submit" variant="primary" fullWidth>
          Log in
        </Button>
      </form>

      <div className={styles.links}>
        {/* Reset */}
        <div className={styles.link}>
          <p>Forgot password?</p>
          <Button As={Link} variant="link" href="/reset">
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
    </AuthFormShell>
  );
}
