import Footer from "../../components/layout/Footer";
import LandingNav from "./LandingNav";
import Hero from "./sections/Hero";
import TrustedCompanies from "./sections/TrustedCompanies";
import Features from "./sections/Features";
import DashboardPreview from "./sections/DashboardPreview";
import AIAutomation from "./sections/AIAutomation";
import Analytics from "./sections/Analytics";
import WhyZkr from "./sections/WhyZkr";
import Integrations from "./sections/Integrations";
import Testimonials from "./sections/Testimonials";
import Pricing from "./sections/Pricing";
import FAQ from "./sections/FAQ";
import FinalCta from "./sections/FinalCta";
import { useLenis } from "./useLenis";
import styles from "./Landing.module.css";

function Landing() {
  useLenis();

  return (
    <div className={styles.page} data-theme="dark">
      <LandingNav />
      <main>
        <Hero />
        <TrustedCompanies />
        <Features />
        <DashboardPreview />
        <AIAutomation />
        <Analytics />
        <WhyZkr />
        <Integrations />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
