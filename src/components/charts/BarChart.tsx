import styles from "./BarChart.module.css";
import type { ChartPoint } from "../../types/entities";

interface BarChartProps {
  data: ChartPoint[];
  height?: number;
  color?: string;
  multiColor?: boolean;
}

const PALETTE_CYCLE = [
  "#168aad",
  "#52b69a",
  "#76c893",
  "#99d98c",
  "#1e6091",
  "#34a0a4",
  "#b5e48c",
  "#1a759f",
];

function BarChart({ data, height = 220, color, multiColor = false }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div
      className={styles.wrap}
      style={color ? { height, ["--chart-color" as string]: color } : { height }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
        {data.map((point, index) => {
          const barHeight = (point.value / max) * 90;
          const x = index * barWidth + barWidth * 0.2;
          const width = barWidth * 0.6;
          const barColor = multiColor ? PALETTE_CYCLE[index % PALETTE_CYCLE.length] : undefined;
          return (
            <rect
              key={point.label}
              x={x}
              y={100 - barHeight}
              width={width}
              height={barHeight}
              rx={1.5}
              className={styles.bar}
              style={barColor ? { fill: barColor } : undefined}
            />
          );
        })}
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

export default BarChart;