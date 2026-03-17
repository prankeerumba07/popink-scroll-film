import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="relative py-16 px-4 md:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-3xl md:text-5xl text-foreground tracking-[0.2em] mb-8"
        >
          THE STUDIO
        </motion.h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mb-10" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 0.7, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-foreground/70 text-lg md:text-xl leading-relaxed tagline-word italic"
        >
          We don't just ink skin; we archive stories. PopInk Studios is a sanctuary for those who view their body as a canvas for the avant-garde.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 0.5, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-muted-foreground text-base mt-6 tagline-word"
        >
          Precision. Patience. Permanence.
        </motion.p>
      </div>
    </section>
  );
};

export default AboutSection;
