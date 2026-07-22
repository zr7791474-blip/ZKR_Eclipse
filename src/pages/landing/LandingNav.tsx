import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import styles from "./LandingNav.module.css";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#preview", label: "Product" },
  { href: "#ai", label: "AI" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

function LandingNav() {
  const [isScrolled, setScrolled] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector(link.href)).filter(
      (el): el is Element => Boolean(el),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveHash(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  return (
    <header className={styles.nav} data-scrolled={isScrolled || undefined}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img src="/zkr.jpg" alt="ZKR Eclipse" className={styles.logo} />
          <span>ZKR Eclipse</span>
        </Link>

        <nav className={styles.links}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.link}
              data-active={activeHash === link.href || undefined}
              aria-current={activeHash === link.href ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/login" className={styles.signIn}>
            Sign in
          </Link>
          <Link to="/register" className={styles.getStarted}>
            Get started
          </Link>
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMobileOpen}
          aria-controls="landing-mobile-menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileOpen && (
        <div className={styles.mobileMenu} id="landing-mobile-menu">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link to="/login" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Sign in
          </Link>
          <Link to="/register" className={styles.getStarted} onClick={() => setMobileOpen(false)}>
            Get started
          </Link>
        </div>
      )}
    </header>
  );
}

export default LandingNav;
