import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const styles = [
  {
    title: "HYPER-REALISM",
    subtitle: "Portraits & photographic precision",
  },
  {
    title: "GEOMETRIC",
    subtitle: "Sacred patterns & mathematical beauty",
  },
  {
    title: "BLACKWORK",
    subtitle: "Bold statements in pure black ink",
  },
];

const StyleCategoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section ref={ref} className="relative py-14 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em]">SIGNATURE STYLES</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {styles.map((style, i) => (
          <motion.div
            key={style.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            className="group relative border border-border/30 rounded-sm p-8 md:p-10 cursor-pointer overflow-hidden transition-all duration-700 hover:border-primary/40"
          >
            {/* Red glow on hover */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700" />
            {/* Zoom effect */}
            <div className="relative z-10 text-center transition-transform duration-700 group-hover:scale-105">
              <h3 className="text-lg md:text-xl text-foreground tracking-[0.25em] mb-3">{style.title}</h3>
              <p className="text-muted-foreground text-xs tracking-[0.15em] tagline-word italic">{style.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StyleCategoriesSection;
