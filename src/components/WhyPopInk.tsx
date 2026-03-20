import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const pillars = [
  { word: "Precision", desc: "Every line is deliberate. Every dot intentional. We don't rush art." },
  { word: "Craft", desc: "Years of discipline distilled into a single needle. Technique is everything." },
  { word: "Identity", desc: "Your story, permanently etched. We don't decorate — we define." },
];

const WhyPopInk = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-16 px-4 md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary))_0%,transparent_60%)] opacity-20" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-12 relative z-10"
      >
        <p className="text-primary/60 text-[10px] tracking-[0.4em] uppercase mb-3">Why People Choose</p>
        <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em]">POPINK</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
      </motion.div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {pillars.map((p, i) => (
          <motion.div
            key={p.word}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h3 className="text-2xl md:text-3xl text-foreground tracking-[0.15em] mb-3">{p.word}</h3>
            <p className="text-foreground/40 text-sm leading-relaxed tagline-word italic">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyPopInk;
