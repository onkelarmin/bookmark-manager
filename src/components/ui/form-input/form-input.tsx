import styles from "./form-input.module.scss";
import { ComponentPropsWithRef } from "react";

type FormInputProps = {
  name: string;
  label: string;
  errorMessage?: string;
} & ComponentPropsWithRef<"input">;

export function FormInput({
  type,
  name,
  label,
  errorMessage,
  ...rest
}: FormInputProps) {
  return (
    <label className={styles.container}>
      <span className={styles.label}>{label}</span>
      <input
        type={type}
        name={name}
        className={styles.input}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
        {...rest}
      />
      {errorMessage && (
        <span id={`${name}-error`} className={styles.error} role="status">
          {errorMessage}
        </span>
      )}
    </label>
  );
}
