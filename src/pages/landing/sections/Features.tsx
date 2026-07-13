import {
  FolderKanban,
  BarChart3,
  Users,
  Zap,
  ShieldCheck,
  Layers,
} from "lucide-react";
import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Project command center",
    description: "Track every project's status, priority, and progress in one clean board — no spreadsheets required.",
  },
  {
    icon: BarChart3,
    title: "Live revenue analytics",
    description: "Real-time charts for revenue, orders, and growth, aggregated straight from your workspace data.",
  },
  {
    icon: Zap,
    title: "AI-surfaced insights",
    description: "Get a daily read on what's trending up, what's slipping, and what needs your attention first.",
  },
  {
    icon: Users,
    title: "Team-first workflows",
    description: "Roles, permissions, and workspaces built for teams that move fast without stepping on each other.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade access",
    description: "Granular role-based access control across Admins, Managers, Analysts, and Viewers.",
  },
  {
    icon: Layers,
    title: "One unified workspace",
    description: "Projects, orders, products, and people — connected in a single, coherent system of record.",
  },
];

function Features() {
  return (
    <section className={shared.section} id="features">
      <div className={shared.container}>
        <Reveal>
          <div className={shared.sectionHeader}>
            <span className={shared.eyebrow}>Features</span>
            <h2 className={shared.sectionTitle}>Everything your team needs, nothing it doesn't</h2>
            <p className={shared.sectionSubtitle}>
              Built for teams who are tired of stitching five tools together
              just to see how the business is doing.
            </p>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <div className={styles.card}>
                <span className={styles.cardGlow} aria-hidden="true" />
                <span className={styles.iconWrap}>
                  <feature.icon size={20} />
                </span>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardText}>{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
