import { Quote } from "lucide-react";
import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./Testimonials.module.css";

const TESTIMONIALS = [
  {
    quote:
      "We replaced four separate tools with ZKR Eclipse in a week. Our weekly reporting went from a half-day task to a five-minute glance.",
    name: "Priya Nair",
    role: "Head of Operations, Nimbus Inc.",
  },
  {
    quote:
      "The AI insights actually catch things we would've missed — like a project quietly slipping behind before it became a fire drill.",
    name: "Jamie Chen",
    role: "COO, Forge Digital",
  },
  {
    quote:
      "Fast, clean, and it doesn't get in the way. Exactly what a dashboard should feel like.",
    name: "Sam Ortiz",
    role: "Product Lead, Vertex Labs",
  },
];

function Testimonials() {
  return (
    <section className={shared.section}>
      <div className={shared.container}>
        <Reveal>
          <div className={shared.sectionHeader}>
            <span className={shared.eyebrow}>Testimonials</span>
            <h2 className={shared.sectionTitle}>Loved by operators, not just admins</h2>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.08}>
              <div className={styles.card}>
                <Quote size={22} className={styles.quoteIcon} />
                <p className={styles.quote}>{testimonial.quote}</p>
                <div className={styles.author}>
                  <span className={styles.name}>{testimonial.name}</span>
                  <span className={styles.role}>{testimonial.role}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
