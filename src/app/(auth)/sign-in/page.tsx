import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import { SignInContent } from "./sign-in-content";

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

      <SignInContent />
    </AuthFormShell>
  );
}
