import type { CSSProperties } from "react";
import styles from "./LineChart.module.css";
import type { ChartPoint } from "../../types/entities";

interface LineChartProps {
  data: ChartPoint[];
  height?: number;
  color?: string;
}

function LineChart({ data, height = 220, color }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((point.value - min) / range) * 90 - 5;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L100,100 L0,100 Z`;

  return (
    <div
      className={styles.wrap}
      style={color ? ({ height, "--chart-color": color } as CSSProperties) : { height }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
        <path d={areaPath} className={styles.area} />
        <path d={linePath} className={styles.line} />
      </svg>
      <div className={styles.labels}>
        {data.map((point) => (
          <span key={point.label} className={styles.labelItem}>
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default LineChart;