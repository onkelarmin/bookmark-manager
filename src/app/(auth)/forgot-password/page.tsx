import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import { ForgotPasswordContent } from "./forgot-password-content";

export default function ForgotPasswordPage() {
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

      <ForgotPasswordContent />
    </AuthFormShell>
  );
}
