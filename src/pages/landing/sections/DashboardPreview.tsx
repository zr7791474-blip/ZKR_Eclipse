import { DollarSign, Users, TrendingUp, Activity } from "lucide-react";
import StatCard from "../../../components/ui/StatCard";
import LineChart from "../../../components/charts/LineChart";
import Card from "../../../components/ui/Card";
import { revenueByMonth } from "../../../data/mockData";
import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./DashboardPreview.module.css";

const PREVIEW_STATS = [
  { label: "Revenue", value: "$48,290", change: "+12.4%", icon: DollarSign, trend: [30, 34, 32, 40, 38, 46, 48] },
  { label: "Active Users", value: "9,821", change: "+4.1%", icon: Users, trend: [80, 82, 79, 85, 88, 90, 92] },
  { label: "Productivity Score", value: "94", change: "+3.2%", icon: TrendingUp, trend: [70, 74, 78, 82, 86, 90, 94] },
];

function DashboardPreview() {
  return (
    <section className={shared.section} id="preview">
      <div className={shared.container}>
        <Reveal>
          <div className={shared.sectionHeader}>
            <span className={shared.eyebrow}>Live preview</span>
            <h2 className={shared.sectionTitle}>The real dashboard, not a mockup</h2>
            <p className={shared.sectionSubtitle}>
              What you see here is the actual ZKR Eclipse interface — the same
              cards and charts you'll use every day.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className={styles.frame}>
            <div className={styles.frameGlow} aria-hidden="true" />
            <div className={styles.statsRow}>
              {PREVIEW_STATS.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
            <Card className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>
                  <Activity size={14} />
                  Revenue overview
                </span>
                <span className={styles.chartMeta}>Last 7 months</span>
              </div>
              <LineChart data={revenueByMonth} height={180} color="#168aad" />
            </Card>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default DashboardPreview;
