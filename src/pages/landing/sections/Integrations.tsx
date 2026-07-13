import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./Integrations.module.css";

const INTEGRATIONS = [
  "Slack",
  "Notion",
  "GitHub",
  "Figma",
  "Google Drive",
  "Zapier",
  "Linear",
  "Stripe",
];

function Integrations() {
  return (
    <section className={shared.section}>
      <div className={shared.container}>
        <Reveal>
          <div className={shared.sectionHeader}>
            <span className={shared.eyebrow}>Integrations</span>
            <h2 className={shared.sectionTitle}>Plays well with your stack</h2>
            <p className={shared.sectionSubtitle}>
              Connect the tools your team already uses — no rip-and-replace required.
            </p>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {INTEGRATIONS.map((name, index) => (
            <Reveal key={name} delay={index * 0.04}>
              <div className={styles.chip}>{name}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Integrations;
