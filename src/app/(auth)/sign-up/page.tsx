import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import { SignUpContent } from "./sign-up-content";

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

      <SignUpContent />
    </AuthFormShell>
  );
}
