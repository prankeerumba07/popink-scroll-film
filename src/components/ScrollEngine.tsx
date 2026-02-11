import { useEffect } from "react";

/**
 * Custom scroll engine: adds slight resistance for a premium feel
 * and enables smooth scroll behavior globally.
 */
const ScrollEngine = () => {
  useEffect(() => {
    // Apply smooth scroll to html
    document.documentElement.style.scrollBehavior = "smooth";

    // Slight scroll resistance via wheel event dampening
    let ticking = false;
    const handleWheel = (e: WheelEvent) => {
      // Only dampen on main document scroll
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        // Reduce scroll delta for a heavier, more premium feel
        const dampening = 0.65;
        window.scrollBy({
          top: e.deltaY * dampening,
          behavior: "auto",
        });
        ticking = false;
      });
    };

    // Passive false so we can influence scroll
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return null;
};

export default ScrollEngine;
