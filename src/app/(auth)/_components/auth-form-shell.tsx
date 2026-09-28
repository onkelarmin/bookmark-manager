import styles from "../auth.module.scss";
import { Logo } from "@/components/logo";
import { ReactNode } from "react";

type AuthFormShellProps = {
  children: ReactNode;
};

export function AuthFormShell({ children }: AuthFormShellProps) {
  return (
    <section className={styles.shell}>
      <Logo />
      {children}
    </section>
  );
}
