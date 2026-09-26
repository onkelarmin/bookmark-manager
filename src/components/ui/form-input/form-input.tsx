import styles from "./form-input.module.scss";
import { ComponentPropsWithRef } from "react";

type FormInputProps = {
  name: string;
  label: string;
  errorMessage?: string;
} & ComponentPropsWithRef<"input">;

export function FormInput({
  name,
  label,
  errorMessage,
  ...rest
}: FormInputProps) {
  return (
    <div>
      <label className={styles.container}>
        <span className={styles.label}>{label}</span>
        <input
          name={name}
          className={styles.input}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${name}-error` : undefined}
          {...rest}
        />
      </label>
      {errorMessage && (
        <div id={`${name}-error`} className={styles.error} role="status">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
