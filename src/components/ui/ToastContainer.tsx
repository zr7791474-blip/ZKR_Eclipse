import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import styles from "./ToastContainer.module.css";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className={styles.wrap}>
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className={styles.toast}
              data-type={toast.type}
            >
              <Icon size={18} className={styles.icon} />
              <span className={styles.message}>{toast.message}</span>
              <button
                className={styles.close}
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;