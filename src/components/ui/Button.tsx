import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  iconOnly?: boolean;
}

function Button({
  children,
  variant = "primary",
  loading = false,
  iconOnly = false,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${className}`}
      data-variant={variant}
      data-icon-only={iconOnly || undefined}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={styles.label} data-hidden={loading || undefined}>
        {children}
      </span>
    </button>
  );
}

export default Button;