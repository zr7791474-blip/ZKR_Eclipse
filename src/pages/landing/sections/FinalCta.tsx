import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./FinalCta.module.css";

function FinalCta() {
  return (
    <section className={shared.section}>
      <div className={shared.container}>
        <Reveal>
          <div className={styles.banner}>
            <span className={styles.glow} aria-hidden="true" />
            <h2 className={styles.title}>Ready to run on one control deck?</h2>
            <p className={styles.subtitle}>
              Join 1,200+ teams who traded five disconnected tools for one
              premium dashboard.
            </p>
            <div className={styles.actions}>
              <Link to="/register" className={styles.primary}>
                Get started free
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className={styles.secondary}>
                Sign in
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default FinalCta;
