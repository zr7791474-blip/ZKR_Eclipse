import { useMemo, useState, type CSSProperties } from "react";
import { Download, FileText, Search } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import DonutChart from "../components/charts/DonutChart";
import HeatmapChart from "../components/charts/HeatmapChart";
import EmptyState from "../components/ui/EmptyState";
import { useProjects } from "../hooks/useProjects";
import { useOrders } from "../hooks/useOrders";
import { useToast } from "../hooks/useToast";
import { revenueByMonth, visitorsByDay } from "../data/mockData";
import type { ChartPoint, Project } from "../types/entities";
import styles from "./Reports.module.css";

type RangeFilter = "today" | "week" | "month" | "year";

const RANGE_LABELS: Record<RangeFilter, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

const RANGE_DAYS: Record<RangeFilter, number> = {
  today: 1,
  week: 7,
  month: 30,
  year: 365,
};

function parseOrderDate(dateStr: string) {
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function withinRange(date: Date | null, range: RangeFilter, now: Date) {
  if (!date) return false;
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= RANGE_DAYS[range];
}

function toCsv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => (cell.includes(",") ? `"${cell.replace(/"/g, '""')}"` : cell))
        .join(","),
    )
    .join("\n");
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const PRIORITY_ORDER: Project["priority"][] = ["high", "medium", "low"];
const STATUS_ORDER: Project["status"][] = ["active", "on-hold", "completed"];
const STATUS_COLORS: Record<Project["status"], string> = {
  active: "#76c893",
  "on-hold": "#d9ed92",
  completed: "#1e6091",
};

function Reports() {
  const { projects } = useProjects();
  const { orders } = useOrders();
  const { showToast } = useToast();
  const [range, setRange] = useState<RangeFilter>("month");
  const [search, setSearch] = useState("");

  const now = useMemo(() => new Date(), []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => withinRange(parseOrderDate(order.date), range, now))
      .filter((order) =>
        `${order.customer} ${order.id}`.toLowerCase().includes(search.toLowerCase()),
      );
  }, [orders, range, search, now]);

  const ordersChartData: ChartPoint[] = useMemo(() => {
    const byDate = new Map<string, number>();
    filteredOrders.forEach((order) => {
      byDate.set(order.id, order.amount);
    });
    const source = filteredOrders.length > 0 ? filteredOrders : orders;
    return source.map((order) => ({ label: order.date.split(",")[0], value: order.amount }));
  }, [filteredOrders, orders]);

  const heatmapData = useMemo(() => {
    const realCounts = new Map<string, number>();
    orders.forEach((order) => {
      const parsed = parseOrderDate(order.date);
      if (!parsed) return;
      const key = parsed.toISOString().slice(0, 10);
      realCounts.set(key, (realCounts.get(key) ?? 0) + 1);
    });

    const days: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      const real = realCounts.get(key);
      // Fall back to a deterministic (not random each render) pattern so the
      // full 12-week view stays populated even outside the small real
      // order-date range in the mock dataset.
      const seeded = real ?? ((date.getDate() * 7 + date.getDay() * 3) % 5);
      days.push({ date: key, count: seeded });
    }
    return days;
  }, [orders]);

  const totalRevenue = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + order.amount, 0),
    [filteredOrders],
  );

  const statusBreakdown = useMemo(() => {
    const activeProjects = projects.filter((p) => !p.archived);
    return STATUS_ORDER.map((status) => {
      const count = activeProjects.filter((p) => p.status === status).length;
      const pct = activeProjects.length > 0 ? Math.round((count / activeProjects.length) * 100) : 0;
      return { status, count, pct };
    });
  }, [projects]);

  const priorityBreakdown = useMemo(() => {
    const activeProjects = projects.filter((p) => !p.archived);
    return PRIORITY_ORDER.map((priority) => {
      const count = activeProjects.filter((p) => p.priority === priority).length;
      const pct = activeProjects.length > 0 ? Math.round((count / activeProjects.length) * 100) : 0;
      return { priority, count, pct };
    });
  }, [projects]);

  const avgCompletion = useMemo(() => {
    const activeProjects = projects.filter((p) => !p.archived);
    if (activeProjects.length === 0) return 0;
    return Math.round(
      activeProjects.reduce((sum, p) => sum + p.progress, 0) / activeProjects.length,
    );
  }, [projects]);

  function handleExportCsv() {
    const rows = [
      ["Order ID", "Customer", "Date", "Status", "Amount"],
      ...filteredOrders.map((order) => [
        order.id,
        order.customer,
        order.date,
        order.status,
        String(order.amount),
      ]),
    ];
    downloadBlob(toCsv(rows), `zkr-eclipse-report-${range}.csv`, "text/csv;charset=utf-8;");
    showToast("CSV export downloaded.", "success");
  }

  function handleExportPdf() {
    showToast("Preparing PDF via your browser's print dialog...", "info");
    window.print();
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Reports"
        description="Revenue, growth, and project analytics for your workspace."
        actions={
          <>
            <Button variant="secondary" onClick={handleExportCsv}>
              <Download size={16} />
              Export CSV
            </Button>
            <Button variant="secondary" onClick={handleExportPdf}>
              <FileText size={16} />
              Export PDF
            </Button>
          </>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.rangeTabs}>
          {(Object.keys(RANGE_LABELS) as RangeFilter[]).map((key) => (
            <button
              key={key}
              className={styles.rangeTab}
              data-active={range === key || undefined}
              onClick={() => setRange(key)}
            >
              {RANGE_LABELS[key]}
            </button>
          ))}
        </div>

        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search orders by customer or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.summaryRow}>
        <Card className={styles.summaryCard} style={{ "--kpi-accent": "#168aad" } as CSSProperties}>
          <span className={styles.summaryLabel}>Revenue ({RANGE_LABELS[range]})</span>
          <span className={styles.summaryValue}>${totalRevenue.toLocaleString()}</span>
        </Card>
        <Card className={styles.summaryCard} style={{ "--kpi-accent": "#52b69a" } as CSSProperties}>
          <span className={styles.summaryLabel}>Orders ({RANGE_LABELS[range]})</span>
          <span className={styles.summaryValue}>{filteredOrders.length}</span>
        </Card>
        <Card className={styles.summaryCard} style={{ "--kpi-accent": "#1e6091" } as CSSProperties}>
          <span className={styles.summaryLabel}>Avg. project completion</span>
          <span className={styles.summaryValue}>{avgCompletion}%</span>
        </Card>
      </div>

      <div className={styles.chartGrid}>
        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Revenue</h3>
          <LineChart data={revenueByMonth} height={200} color="#168aad" />
        </Card>

        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>User growth</h3>
          <LineChart data={visitorsByDay} height={200} color="#76c893" />
        </Card>

        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Orders ({RANGE_LABELS[range]})</h3>
          {ordersChartData.length > 0 ? (
            <BarChart data={ordersChartData} height={200} multiColor />
          ) : (
            <EmptyState icon={Search} title="No orders in this range" />
          )}
        </Card>

        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Project status distribution</h3>
          <DonutChart
            data={statusBreakdown.map((row) => ({
              label: row.status,
              value: row.count,
              color: STATUS_COLORS[row.status],
            }))}
            centerLabel={String(statusBreakdown.reduce((sum, row) => sum + row.count, 0))}
          />
        </Card>

        <Card className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Project priority distribution</h3>
          <div className={styles.breakdownList}>
            {priorityBreakdown.map((row) => (
              <div key={row.priority} className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>{row.priority}</span>
                <ProgressBar value={row.pct} label={`${row.count}`} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Order activity (last 12 weeks)</h3>
        <HeatmapChart data={heatmapData} />
      </Card>

      <Card className={styles.tableCard}>
        <h3 className={styles.chartTitle}>Orders in range</h3>
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching orders"
            description="Try a different date range or search term."
          />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td className={styles.capitalize}>{order.status}</td>
                  <td>${order.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

export default Reports;
