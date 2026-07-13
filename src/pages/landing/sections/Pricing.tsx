import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./Pricing.module.css";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "/ forever",
    description: "For small teams getting off spreadsheets.",
    features: ["Up to 5 team members", "3 active projects", "Basic analytics", "Community support"],
    cta: "Start for free",
    featured: false,
  },
  {
    name: "Growth",
    price: "$79",
    period: "/ month",
    description: "For teams ready to scale operations.",
    features: [
      "Up to 25 team members",
      "Unlimited projects",
      "AI-powered insights",
      "Advanced reports & exports",
      "Priority support",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with complex needs.",
    features: [
      "Unlimited members",
      "SSO & audit logs",
      "Dedicated success manager",
      "Custom integrations",
      "99.98% uptime SLA",
    ],
    cta: "Talk to sales",
    featured: false,
  },
];

function Pricing() {
  return (
    <section className={shared.section} id="pricing">
      <div className={shared.container}>
        <Reveal>
          <div className={shared.sectionHeader}>
            <span className={shared.eyebrow}>Pricing</span>
            <h2 className={shared.sectionTitle}>Simple pricing, no surprises</h2>
            <p className={shared.sectionSubtitle}>
              Start free. Upgrade when your team needs more room to grow.
            </p>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.08}>
              <div className={styles.card} data-featured={plan.featured || undefined}>
                {plan.featured && <span className={styles.badge}>Most popular</span>}
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planDescription}>{plan.description}</p>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>{plan.period}</span>
                </div>
                <ul className={styles.featureList}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.featureItem}>
                      <Check size={15} className={styles.featureIcon} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={plan.featured ? styles.ctaPrimary : styles.ctaSecondary}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
