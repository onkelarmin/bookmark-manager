import styles from "../auth.module.scss";
import { Heading } from "@/components/ui/heading/Heading";
import { AuthFormShell } from "../_components/auth-form-shell";
import {
  SkeletonButton,
  SkeletonInput,
  SkeletonText,
} from "@/components/ui/skeleton/skeleton";
import { Suspense } from "react";
import { VerifyEmailContent } from "./verify-email-content";

export default function VerifyEmailPage() {
  return (
    <AuthFormShell>
      <div className="flow-lg">
        <Heading tag="h1" size="h1">
          Verify your email
        </Heading>

        <Suspense fallback={<VerificationSkeleton />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </AuthFormShell>
  );
}

function VerificationSkeleton() {
  return (
    <>
      <div className="flow-xs">
        <SkeletonText />
        <SkeletonText />
      </div>
      <div className={styles.form}>
        <SkeletonText fullWidth={false} />
        <SkeletonInput />
        <SkeletonButton fullWidth />
        <SkeletonButton fullWidth />
      </div>
    </>
  );
}
