import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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
      <div className={styles.sweepA} aria-hidden="true" />
      <div className={styles.sweepB} aria-hidden="true" />
      <div className={`${styles.noise} noise-overlay`} aria-hidden="true" />

      <Link to="/" className={styles.homeLink}>
        <ChevronLeft size={15} />
        Home
      </Link>

      <div className={styles.content}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.glassPanel}>
            <div className={styles.logoMark}>
              <img src="/zkr.jpg" alt="ZKR Eclipse" className={styles.logoImage} />
            </div>

            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>

            <div className={styles.formWrap}>{children}</div>

            {footer && <div className={styles.footer}>{footer}</div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;
