import { AuthFormShell } from "../_components/auth-form-shell";
import { Suspense } from "react";
import {
  VerifyEmailContent,
  VerifyEmailContentSkeleton,
} from "./verify-email-content";

export default function VerifyEmailPage() {
  return (
    <AuthFormShell>
      <Suspense fallback={<VerifyEmailContentSkeleton />}>
        <VerifyEmailContent />
      </Suspense>
    </AuthFormShell>
  );
}
