import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import styles from "../auth.module.scss";
import { FormInput } from "@/components/ui/form-input/form-input";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";

export default function ResetPage() {
  return (
    <AuthFormShell>
      <div>
        <Heading tag="h1" size="h1">
          Forgot your password?
        </Heading>
        <p className="mar-block-start-xs">
          Enter your email address below and we’ll send you a link to reset your
          password.
        </p>
      </div>

      <form className={styles.form}>
        <FormInput
          type="email"
          name="email"
          label="Email *"
          autoComplete="email"
          inputMode="email"
          maxLength={256}
        />
        <Button type="submit" variant="primary" fullWidth>
          Send reset link
        </Button>
      </form>

      <div className={styles.links}>
        {/* Log in */}
        <div className={styles.link}>
          <Button As={Link} variant="link" href="/sign-in">
            Back to login
          </Button>
        </div>
      </div>
    </AuthFormShell>
  );
}
