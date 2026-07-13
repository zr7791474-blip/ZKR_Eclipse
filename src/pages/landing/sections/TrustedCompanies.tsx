import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./TrustedCompanies.module.css";

const COMPANIES = [
  "Nimbus Inc.",
  "Halcyon Co.",
  "Forge Digital",
  "Vertex Labs",
  "Atlas Studio",
  "Lumen Health",
];

function TrustedCompanies() {
  return (
    <section className={shared.section}>
      <div className={shared.container}>
        <Reveal>
          <p className={styles.label}>Trusted by fast-moving teams</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={styles.logoRow}>
            {COMPANIES.map((name) => (
              <span key={name} className={styles.logo}>
                {name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default TrustedCompanies;
