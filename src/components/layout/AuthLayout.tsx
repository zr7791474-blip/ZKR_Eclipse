import type { ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.illustration}>
        <span className={styles.blob} data-blob="1" aria-hidden="true" />
        <span className={styles.blob} data-blob="2" aria-hidden="true" />
        <span className={styles.blob} data-blob="3" aria-hidden="true" />
        <div className={styles.illustrationContent}>
          <img src="/zkr.jpg" alt="ZKR Eclipse logo" className={styles.logo} />
          <h2 className={styles.illustrationTitle}>ZKR Eclipse</h2>
          <p className={styles.illustrationText}>
            One control deck for revenue, projects, and teams — built for
            teams who move fast.
          </p>
        </div>
      </div>

      <div className={styles.formSide}>
        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;
