import styles from "./Badge.module.css";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

function Badge({ label, variant = "neutral" }: BadgeProps) {
  return (
    <span className={styles.badge} data-variant={variant}>
      {label}
    </span>
  );
}

export default Badge;