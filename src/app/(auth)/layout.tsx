import styles from "./auth.module.scss";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};
export default function AuthLayout({ children }: AuthLayoutProps) {
  return <div className={styles.layout}>{children}</div>;
}
