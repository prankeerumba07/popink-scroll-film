import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { portfolioItems } from "@/data/media";

/**
 * Interpolate between two hex colors based on a ratio (0–1).
 */
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bl})`;
}

const PortfolioScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentBg, setCurrentBg] = useState(portfolioItems[0]?.bgColor || "#1a1a1a");

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const scrollTop = window.scrollY - el.offsetTop;
      const scrollHeight = el.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrollTop / scrollHeight));
      setScrollProgress(Math.round(progress * 100));

      // Determine which section we're in and interpolate bg color
      const sectionHeight = window.innerHeight;
      const totalSections = portfolioItems.length;
      const rawIndex = scrollTop / sectionHeight;
      const index = Math.max(0, Math.min(totalSections - 1, Math.floor(rawIndex)));
      const nextIndex = Math.min(totalSections - 1, index + 1);
      const ratio = rawIndex - index;
      const clampedRatio = Math.max(0, Math.min(1, ratio));

      const color = lerpColor(
        portfolioItems[index].bgColor,
        portfolioItems[nextIndex].bgColor,
        clampedRatio
      );
      setCurrentBg(color);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ backgroundColor: currentBg, transition: "background-color 0.1s linear" }}>
      {portfolioItems.map((item, i) => (
        <section
          key={item.id}
          className="min-h-screen flex flex-col items-center justify-center relative px-4 md:px-12"
        >
          {/* Gradient overlay at top for blending */}
          {i > 0 && (
            <div
              className="absolute top-0 left-0 right-0 h-[30vh] pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, ${portfolioItems[i - 1].bgColor}, transparent)`,
              }}
            />
          )}

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[55vw] md:max-w-[50vw] lg:max-w-[45vw]"
          >
            <img
              src={item.src}
              alt={item.alt}
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full h-auto object-contain shadow-2xl"
            />
          </motion.div>

          {/* Caption */}
          {(item.year || item.caption) && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative z-10 flex items-baseline gap-6 mt-6 text-sm md:text-base"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {item.year && <span className="font-light tracking-wider">{item.year}</span>}
              {item.caption && <span className="font-light tracking-wide">{item.caption}</span>}
            </motion.div>
          )}
        </section>
      ))}
    </div>
  );
};

export default PortfolioScroll;
