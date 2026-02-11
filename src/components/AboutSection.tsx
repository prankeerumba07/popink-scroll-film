import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const clipTop = useTransform(scrollYProgress, [0, 0.6], [30, 0]);
  const clipPath = useTransform(clipTop, (v) => `inset(${v}% 0 0 0)`);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={ref} className="relative py-24 px-4 md:px-12">
      <motion.div style={{ clipPath, opacity }} className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em] mb-8">
          THE STUDIO
        </h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mb-10" />
        <p className="text-foreground/70 text-lg md:text-xl leading-relaxed tagline-word italic">
          Born from a love of ink and intention. Every piece we create
          is a collaboration between artist and canvas — your skin, your story.
        </p>
        <p className="text-muted-foreground text-base mt-6 tagline-word">
          Precision. Patience. Permanence.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
