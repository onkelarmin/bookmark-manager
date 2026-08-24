import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonProps<T extends ElementType> = {
  As?: T;
  variant?: "primary" | "secondary" | "link";
  type?: ComponentPropsWithoutRef<T>["type"];
  fullWidth?: boolean;
  classes?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

const DEFAULT_TYPE = "button";

export function Button<T extends ElementType = typeof DEFAULT_TYPE>({
  As,
  variant = "primary",
  type,
  fullWidth = false,
  classes,
  children,
  ...rest
}: ButtonProps<T>) {
  const Component = As ?? DEFAULT_TYPE;

  return (
    <Component
      className={`${styles.button} ${classes ? classes : ""}`}
      data-variant={variant}
      data-full-width={fullWidth ? fullWidth : undefined}
      type={type != null ? type : Component === "button" ? "button" : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}
