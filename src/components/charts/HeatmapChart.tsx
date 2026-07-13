import styles from "./HeatmapChart.module.css";

export interface HeatmapDay {
  date: string;
  count: number;
}

interface HeatmapChartProps {
  data: HeatmapDay[];
  weeks?: number;
}

const LEVEL_COLORS = ["#122a2e", "#184e77", "#1e6091", "#34a0a4", "#52b69a", "#99d98c"];

function getLevel(count: number, max: number) {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio > 0.8) return 5;
  if (ratio > 0.6) return 4;
  if (ratio > 0.4) return 3;
  if (ratio > 0.2) return 2;
  return 1;
}

function HeatmapChart({ data, weeks = 12 }: HeatmapChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const days = data.slice(-weeks * 7);

  // Pad the front so the grid always starts on a Sunday column.
  const firstDay = days.length > 0 ? new Date(days[0].date).getDay() : 0;
  const padded: (HeatmapDay | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...days,
  ];

  const columns: (HeatmapDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    columns.push(padded.slice(i, i + 7));
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {columns.map((column, colIndex) => (
          <div key={colIndex} className={styles.column}>
            {column.map((day, rowIndex) =>
              day ? (
                <span
                  key={day.date}
                  className={styles.cell}
                  style={{ backgroundColor: LEVEL_COLORS[getLevel(day.count, max)] }}
                  title={`${day.date}: ${day.count} order${day.count === 1 ? "" : "s"}`}
                />
              ) : (
                <span key={`empty-${rowIndex}`} className={styles.cellEmpty} />
              ),
            )}
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        {LEVEL_COLORS.map((color) => (
          <span key={color} className={styles.legendSwatch} style={{ backgroundColor: color }} />
        ))}
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
}

export default HeatmapChart;
