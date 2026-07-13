import { motion } from "framer-motion";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  label?: string;
}

function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {label !== undefined && <span className={styles.label}>{label}</span>}
    </div>
  );
}

export default ProgressBar;
