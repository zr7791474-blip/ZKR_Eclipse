import styles from "./DonutChart.module.css";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  centerLabel?: string;
}

function DonutChart({ data, size = 160, centerLabel }: DonutChartProps) {
  const total = data.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((segment) => {
    const fraction = segment.value / total;
    const dash = fraction * circumference;
    const segmentOffset = offset;
    offset += dash;
    return { ...segment, dash, segmentOffset, fraction };
  });

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 100 100" width={size} height={size} className={styles.svg}>
        <circle cx="50" cy="50" r={radius} className={styles.track} />
        {segments.map((segment) => (
          <circle
            key={segment.label}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="12"
            strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
            strokeDashoffset={-segment.segmentOffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className={styles.segment}
          />
        ))}
        {centerLabel && (
          <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className={styles.centerLabel}>
            {centerLabel}
          </text>
        )}
      </svg>

      <ul className={styles.legend}>
        {segments.map((segment) => (
          <li key={segment.label} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: segment.color }} />
            <span className={styles.legendLabel}>{segment.label}</span>
            <span className={styles.legendValue}>{Math.round(segment.fraction * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonutChart;
