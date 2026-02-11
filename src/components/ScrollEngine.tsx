import { useEffect } from "react";

const ScrollEngine = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    let ticking = false;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const dampening = 0.65;
        window.scrollBy({
          top: e.deltaY * dampening,
          behavior: "auto",
        });
        ticking = false;
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return null;
};

export default ScrollEngine;
