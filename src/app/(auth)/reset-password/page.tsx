import { AuthFormShell } from "../_components/auth-form-shell";
import {
  ResetPasswordContent,
  ResetPasswordContentSkeleton,
} from "./reset-password-content";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <AuthFormShell>
      <Suspense fallback={<ResetPasswordContentSkeleton />}>
        <ResetPasswordContent />
      </Suspense>
    </AuthFormShell>
  );
}
