import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";

export default function PasswordResetPage() {
  return (
    <AuthFormShell>
      <div>
        <Heading tag="h1" size="h1">
          Password reset successful
        </Heading>
        <p className="mar-block-start-xs">
          Your password has been successfully reset. You can now sign in with
          your new password.
        </p>
      </div>

      <Button As={Link} href="/sign-in" variant="primary" fullWidth>
        Continue to sign in
      </Button>
    </AuthFormShell>
  );
}
