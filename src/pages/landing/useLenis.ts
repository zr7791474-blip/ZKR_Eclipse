import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";

/**
 * Initializes Lenis smooth scrolling for as long as the calling component
 * is mounted, synced to GSAP's ticker so any GSAP-driven scroll animations
 * stay in step with the smoothed scroll position.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
