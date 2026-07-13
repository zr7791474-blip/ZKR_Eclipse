import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import BarChart from "../components/charts/BarChart";
import LineChart from "../components/charts/LineChart";
import ActivityFeed from "../components/activity/ActivityFeed";
import DataTable, { type DataTableColumn } from "../components/tables/DataTable";
import Badge from "../components/ui/Badge";
import {
  revenueByMonth,
  visitorsByDay,
  recentActivity,
  orders,
} from "../data/mockData";
import type { Order } from "../types/entities";
import styles from "./Dashboard.module.css";

const STATS = [
  { label: "Revenue", value: "$48,290", change: "+12.4%", icon: DollarSign, trend: [30, 34, 32, 40, 38, 46, 48] },
  { label: "Active Users", value: "9,821", change: "+4.1%", icon: Users, trend: [80, 82, 79, 85, 88, 90, 92] },
  { label: "Orders", value: "1,204", change: "-2.3%", icon: ShoppingCart, trend: [60, 58, 62, 55, 53, 50, 48] },
  { label: "Growth", value: "18.6%", change: "+1.8%", icon: TrendingUp, trend: [12, 14, 13, 16, 17, 18, 18.6] },
];

const orderStatusVariant: Record<Order["status"], "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  refunded: "neutral",
  failed: "danger",
};

const orderColumns: DataTableColumn<Order>[] = [
  { key: "id", header: "Order", render: (row) => `#${row.id}` },
  { key: "customer", header: "Customer", render: (row) => row.customer },
  { key: "date", header: "Date", render: (row) => row.date },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    render: (row) => `$${row.amount.toFixed(2)}`,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge label={row.status} variant={orderStatusVariant[row.status]} />
    ),
  },
];

function Dashboard() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Dashboard"
        description="Overview of revenue, traffic, and recent orders."
      />

      <section className={styles.statsGrid}>
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className={styles.chartsGrid}>
        <Card>
          <h3 className={styles.cardTitle}>Revenue by month</h3>
          <BarChart data={revenueByMonth} />
        </Card>
        <Card>
          <h3 className={styles.cardTitle}>Visitors this week</h3>
          <LineChart data={visitorsByDay} />
        </Card>
      </section>

      <section className={styles.bottomGrid}>
        <Card className={styles.tableCard} padded={false}>
          <div className={styles.tableCardInner}>
            <h3 className={styles.cardTitle}>Recent orders</h3>
          </div>
          <DataTable
            columns={orderColumns}
            data={orders.slice(0, 5)}
            keyExtractor={(row) => row.id}
          />
        </Card>
        <Card>
          <h3 className={styles.cardTitle}>Recent activity</h3>
          <ActivityFeed items={recentActivity} />
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;