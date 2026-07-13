import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, Sparkles as SparklesIcon, Star } from "lucide-react";
import SceneErrorBoundary from "../three/SceneErrorBoundary";
import styles from "./Hero.module.css";

const FloatingScene = lazy(() => import("../three/FloatingScene"));

const TRUSTED = ["Nimbus", "Halcyon", "Forge Digital", "Vertex Labs", "Atlas Studio"];

function SceneFallback() {
  return <div className={styles.sceneFallback} aria-hidden="true" />;
}

function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;
    const words = headlineRef.current.querySelectorAll("[data-word]");
    gsap.fromTo(
      words,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.15,
      },
    );
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <motion.span
            className={styles.badge}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SparklesIcon size={13} />
            AI-powered workspace intelligence
          </motion.span>

          <h1 className={styles.headline} ref={headlineRef}>
            <span data-word className={styles.headlineLine}>Run your business</span>
            <span data-word className={styles.headlineLine}>
              on <span className={styles.headlineAccent}>one intelligent</span>
            </span>
            <span data-word className={styles.headlineLine}>control deck.</span>
          </h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            ZKR Eclipse unifies projects, revenue, orders, and your team into a
            single premium dashboard — with AI insights that surface what
            matters before you have to ask.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <Link to="/register" className={styles.primaryCta}>
              Get started free
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className={styles.secondaryCta}>
              Sign in
            </Link>
          </motion.div>

          <motion.div
            className={styles.trust}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <div className={styles.rating}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={styles.star} />
                ))}
              </div>
              <span>4.9/5 from 1,200+ teams</span>
            </div>
            <div className={styles.trustLogos}>
              {TRUSTED.map((name) => (
                <span key={name} className={styles.trustLogo}>
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <SceneErrorBoundary fallback={<SceneFallback />}>
            <Suspense fallback={<SceneFallback />}>
              <FloatingScene />
            </Suspense>
          </SceneErrorBoundary>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
