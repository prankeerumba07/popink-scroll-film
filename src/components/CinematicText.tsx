import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface CinematicTextProps {
  text: string;
  className?: string;
}

const CinematicText = ({ text, className = "" }: CinematicTextProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Fade in during first half, fade out during second half
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [40, 0, 0, -30]);

  return (
    <section
      ref={ref}
      className={`min-h-[60vh] flex items-center justify-center relative ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary))_0%,transparent_60%)] opacity-30" />
      <motion.h2
        style={{ opacity, scale, y }}
        className="text-4xl md:text-6xl lg:text-8xl text-foreground text-center tracking-[0.15em] px-4 relative z-10"
      >
        {text}
      </motion.h2>
    </section>
  );
};

export default CinematicText;
