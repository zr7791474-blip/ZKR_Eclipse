import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../Reveal";
import shared from "../LandingShared.module.css";
import styles from "./FAQ.module.css";

const FAQS = [
  {
    question: "Is there a free plan?",
    answer:
      "Yes. The Starter plan is free forever for small teams with up to 5 members and 3 active projects.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Absolutely — upgrade or downgrade at any time from Settings → Billing. Changes apply immediately.",
  },
  {
    question: "How does the AI insight feature work?",
    answer:
      "It analyzes your live workspace data — projects, orders, and revenue — and surfaces plain-language summaries and recommendations automatically.",
  },
  {
    question: "Do you offer role-based permissions?",
    answer:
      "Yes. ZKR Eclipse ships with Admin, Manager, Analyst, and Viewer roles, each with appropriate access out of the box.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Enterprise plans include SSO, audit logs, and a 99.98% uptime SLA. All plans use encrypted connections by default.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={shared.section} id="faq">
      <div className={shared.container}>
        <Reveal>
          <div className={shared.sectionHeader}>
            <span className={shared.eyebrow}>FAQ</span>
            <h2 className={shared.sectionTitle}>Questions, answered</h2>
          </div>
        </Reveal>

        <div className={styles.list}>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.question} delay={index * 0.05}>
                <div className={styles.item} data-open={isOpen || undefined}>
                  <button
                    className={styles.question}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    {faq.question}
                    <ChevronDown size={18} className={styles.chevron} data-open={isOpen || undefined} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.answerWrap}
                      >
                        <p className={styles.answer}>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
