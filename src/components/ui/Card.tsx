import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  style?: CSSProperties;
}

function Card({ children, className = "", padded = true, style }: CardProps) {
  return (
    <div className={`${styles.card} ${padded ? styles.padded : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

export default Card;