import { Mail, FileText } from "lucide-react";
import styles from "./Footer.module.css";

const SOCIALS = [
  {
    name: "X",
    href: "https://x.com/zkr_ad",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
        <path
          fill="currentColor"
          d="M18.9 2H22l-6.77 7.74L23.2 22h-6.06l-4.74-6.2L7 22H3.8l7.25-8.29L3.1 2h6.22l4.28 5.66L18.9 2Zm-1.06 17.9h1.68L8.17 4H6.37l11.47 15.9Z"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/zkreclipse",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
        <path
          fill="currentColor"
          d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.63c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.97V21h-4V9Z"
        />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/zr7791474-blip",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.98c.85 0 1.7.12 2.5.37 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.58.69.48A10.22 10.22 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
        />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:zr779147@gmail.com?subject=Project%20Inquiry&body=Hello%20Zakaria,%0A%0AI%20would%20like%20to%20contact%20you%20regarding...",
    icon: <Mail className={styles.icon} />,
  },
];

const APP_VERSION = "0.1.0";
const BUILD_NUMBER = "2026.07.11";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <p className={styles.text}>
          © {new Date().getFullYear()} ZKR Eclipse. All rights reserved.
        </p>
        <span className={styles.divider} aria-hidden="true" />
        <a
          href="https://github.com/zr7791474-blip"
          target="_blank"
          rel="noreferrer"
          className={styles.metaLink}
        >
          <FileText size={13} />
          Documentation
        </a>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.meta}>
          v{APP_VERSION} · build {BUILD_NUMBER}
        </span>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          All systems operational
        </span>
      </div>

      <div className={styles.socials}>
        {SOCIALS.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.name}
            className={styles.link}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
