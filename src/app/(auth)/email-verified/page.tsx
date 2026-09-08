import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import { Button } from "@/components/ui/button/Button";
import Link from "next/link";

export default function EmailVerifiedPage() {
  return (
    <AuthFormShell>
      <div>
        <Heading tag="h1" size="h1">
          Email verified
        </Heading>
        <p className="mar-block-start-xs">
          Your email has been successfully verified. You can now sign in to your
          account.
        </p>
      </div>

      <Button As={Link} href="/sign-in" variant="primary" fullWidth>
        Continue to sign in
      </Button>
    </AuthFormShell>
  );
}
