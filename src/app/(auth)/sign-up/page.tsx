import styles from "../auth.module.scss";
import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import { FormInput } from "@/components/ui/form-input/form-input";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";

export default function SignUpPage() {
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

      <form className={styles.form}>
        <FormInput
          type="text"
          name="name"
          label="Name *"
          autoComplete="name"
          inputMode="text"
          maxLength={100}
        />
        <FormInput
          type="email"
          name="email"
          label="Email *"
          autoComplete="email"
          inputMode="email"
          maxLength={256}
        />
        <FormInput
          type="password"
          name="password"
          label="Password *"
          autoComplete="new-password"
          inputMode="text"
          maxLength={256}
        />
        <Button type="submit" variant="primary" fullWidth>
          Create account
        </Button>
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
