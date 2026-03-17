import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    num: "01",
    title: "Bespoke Tattooing",
    desc: "The transformation of narrative into pigment. From hyper-realism to avant-garde blackwork, we execute with surgical precision and artistic soul.",
  },
  {
    num: "02",
    title: "Precision Piercing",
    desc: "A curated approach to anatomy. Using only implant-grade titanium and gold, we prioritize health, symmetry, and the architecture of the body.",
  },
  {
    num: "03",
    title: "Design Consultation",
    desc: "The blueprint phase. Sit with our residents to refine your vision into a custom composition that respects the natural flow of your musculature.",
  },
  {
    num: "04",
    title: "Aftercare Ritual",
    desc: "The journey doesn't end at the needle. We provide a medical-grade recovery protocol to ensure your ink remains as sharp as the day it was etched.",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section ref={ref} className="relative py-16 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em]">SERVICES</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-16">
        {services.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            className="group"
          >
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-primary/60 text-sm tracking-[0.3em] font-mono">{s.num}</span>
              <h3 className="text-xl md:text-2xl text-foreground tracking-[0.15em]">{s.title}</h3>
            </div>
            <p className="text-foreground/50 text-sm md:text-base leading-relaxed pl-10 md:pl-14 tagline-word italic">
              {s.desc}
            </p>
            <div className="w-full h-[1px] bg-border/30 mt-8" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
