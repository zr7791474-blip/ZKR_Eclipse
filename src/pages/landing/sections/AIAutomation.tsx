import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./AIAutomation.module.css";

const POINTS = [
  "Flags at-risk projects before deadlines slip",
  "Summarizes weekly performance in plain language",
  "Recommends where to focus based on real trends",
  "Drafts reports from your live workspace data",
];

function AIAutomation() {
  return (
    <section className={shared.section} id="ai">
      <div className={shared.container}>
        <div className={styles.split}>
          <Reveal>
            <div className={styles.visual}>
              <div className={styles.visualGlow} aria-hidden="true" />
              <div className={styles.visualCard}>
                <span className={styles.visualBadge}>
                  <Sparkles size={13} />
                  AI Insight
                </span>
                <p className={styles.visualText}>
                  "Revenue is trending 12% above forecast this month, driven
                  mostly by the Nimbus and Forge accounts. Orders processing
                  time improved by 18%."
                </p>
                <div className={styles.visualFooter}>
                  <span className={styles.visualDot} />
                  Generated 2 minutes ago
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className={styles.copy}>
              <span className={shared.eyebrow}>AI automation</span>
              <h2 className={shared.sectionTitle}>
                An assistant that actually reads your data
              </h2>
              <p className={shared.sectionSubtitle}>
                ZKR Eclipse doesn't just show you charts — it tells you what
                they mean, so your team spends less time digging and more
                time deciding.
              </p>
              <ul className={styles.list}>
                {POINTS.map((point) => (
                  <li key={point} className={styles.listItem}>
                    <CheckCircle2 size={16} className={styles.listIcon} />
                    {point}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={styles.cta}>
                Try it on your data
                <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default AIAutomation;
