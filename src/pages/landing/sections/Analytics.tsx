import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./Analytics.module.css";

const METRICS = [
  { value: "2.4M+", label: "Data points tracked daily" },
  { value: "99.98%", label: "Platform uptime" },
  { value: "38%", label: "Avg. reduction in reporting time" },
  { value: "1,200+", label: "Teams running on ZKR Eclipse" },
];

function Analytics() {
  return (
    <section className={shared.section}>
      <div className={shared.container}>
        <Reveal>
          <div className={shared.sectionHeader}>
            <span className={shared.eyebrow}>By the numbers</span>
            <h2 className={shared.sectionTitle}>Analytics that scale with you</h2>
            <p className={shared.sectionSubtitle}>
              From your first project to your thousandth order, the same
              dashboard keeps up.
            </p>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {METRICS.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.08}>
              <div className={styles.metric}>
                <span className={styles.value}>{metric.value}</span>
                <span className={styles.label}>{metric.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Analytics;
