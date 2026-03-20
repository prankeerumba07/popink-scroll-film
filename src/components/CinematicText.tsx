import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface CinematicTextProps {
  text: string;
  className?: string;
}

const CinematicText = ({ text, className = "" }: CinematicTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-30% 0px -30% 0px" });

  return (
    <section
      ref={ref}
      className={`min-h-[35vh] flex items-center justify-center relative ${className}`}
    >
      {/* Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary))_0%,transparent_60%)] opacity-30" />
      <motion.h2
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl lg:text-8xl text-foreground text-center tracking-[0.15em] px-4 relative z-10"
      >
        {text}
      </motion.h2>
    </section>
  );
};

export default CinematicText;
