import { Gauge, Lock, Sparkles, Layers } from "lucide-react";
import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./WhyZkr.module.css";

const REASONS = [
  {
    icon: Gauge,
    title: "Fast by default",
    description: "No bloated widgets or loading spinners — every view is instant.",
  },
  {
    icon: Layers,
    title: "One source of truth",
    description: "Projects, orders, users, and products live in one connected system.",
  },
  {
    icon: Sparkles,
    title: "AI that's actually useful",
    description: "Insights surface automatically — no prompt engineering required.",
  },
  {
    icon: Lock,
    title: "Built for real teams",
    description: "Role-based access for Admins, Managers, Analysts, and Viewers out of the box.",
  },
];

function WhyZkr() {
  return (
    <section className={shared.section}>
      <div className={shared.container}>
        <Reveal>
          <div className={shared.sectionHeader}>
            <span className={shared.eyebrow}>Why ZKR Eclipse</span>
            <h2 className={shared.sectionTitle}>Built different, on purpose</h2>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {REASONS.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 0.07}>
              <div className={styles.item}>
                <span className={styles.iconWrap}>
                  <reason.icon size={18} />
                </span>
                <div>
                  <h3 className={styles.itemTitle}>{reason.title}</h3>
                  <p className={styles.itemText}>{reason.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyZkr;
