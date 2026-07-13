import type { LucideIcon } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { animate } from "framer-motion";
import styles from "./StatCard.module.css";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend?: number[];
  accentColor?: string;
}

function parseValue(value: string) {
  const match = value.match(/^([^\d.-]*)([\d,]*\.?\d*)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: "", decimals: 0 };
  const [, prefix, numberPart, suffix] = match;
  const decimals = numberPart.includes(".")
    ? numberPart.split(".")[1].length
    : 0;
  return {
    prefix,
    number: parseFloat(numberPart.replace(/,/g, "")) || 0,
    suffix,
    decimals,
  };
}

function formatNumber(num: number, decimals: number) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function Sparkline({ points }: { points: number[] }) {
  const width = 72;
  const height = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1 || 1);
  const path = points
    .map((point, index) => {
      const x = index * step;
      const y = height - ((point - min) / range) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      className={styles.sparkline}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={path} fill="none" strokeWidth="1.75" className={styles.sparklinePath} />
    </svg>
  );
}

function StatCard({ label, value, change, icon: Icon, trend, accentColor }: StatCardProps) {
  const isPositive = change.startsWith("+");
  const parsed = parseValue(value);
  const [displayValue, setDisplayValue] = useState(
    `${parsed.prefix}${formatNumber(0, parsed.decimals)}${parsed.suffix}`,
  );

  useEffect(() => {
    const controls = animate(0, parsed.number, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(
          `${parsed.prefix}${formatNumber(latest, parsed.decimals)}${parsed.suffix}`,
        );
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const cardStyle = accentColor
    ? ({ "--stat-accent": accentColor } as CSSProperties)
    : undefined;

  return (
    <div className={styles.card} style={cardStyle}>
      <span className={styles.accentBar} aria-hidden="true" />
      <div className={styles.header}>
        <span className={styles.iconWrap}>
          <Icon size={17} className={styles.icon} />
        </span>
        {trend && <Sparkline points={trend} />}
      </div>
      <span className={styles.label}>{label}</span>
      <div className={styles.value}>{displayValue}</div>
      <span className={styles.change} data-positive={isPositive || undefined}>
        {change} this month
      </span>
    </div>
  );
}

export default StatCard;