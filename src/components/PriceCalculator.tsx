import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { studioInfo } from "@/data/media";

const sizes = [
  { label: "Small", detail: "Up to 2 inches", price: 3000 },
  { label: "Medium", detail: "3–6 inches", price: 8000 },
  { label: "Large", detail: "7+ inches / Half Sleeve", price: 15000 },
];

const complexities = [
  { label: "Minimalist / Basic", multiplier: 1.0 },
  { label: "Detailed / Shaded", multiplier: 1.5 },
  { label: "Hyper-Realism / Intricate", multiplier: 2.0 },
];

const colorOptions = [
  { label: "Black & Grey", addition: 0 },
  { label: "Full Color", addition: 2000 },
];

const AnimatedPrice = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 600;
    const start = display;
    const diff = value - start;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(start + diff * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <>{display.toLocaleString("en-IN")}</>;
};

const PriceCalculator = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const [sizeIdx, setSizeIdx] = useState<number | null>(null);
  const [complexIdx, setComplexIdx] = useState<number | null>(null);
  const [colorIdx, setColorIdx] = useState<number | null>(null);

  const isComplete = sizeIdx !== null && complexIdx !== null && colorIdx !== null;

  const estimate = isComplete
    ? Math.round(sizes[sizeIdx!].price * complexities[complexIdx!].multiplier + colorOptions[colorIdx!].addition)
    : 0;

  const whatsappMessage = isComplete
    ? encodeURIComponent(
        `Hi PopInk Studios! I just used your online calculator for a ${sizes[sizeIdx!].label} tattoo with ${complexities[complexIdx!].label} detail. I'd like to book a consultation to finalize the design.`
      )
    : "";

  return (
    <section ref={ref} className="relative py-16 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl md:text-6xl text-foreground tracking-[0.2em]">ESTIMATE</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
        <p className="text-muted-foreground text-xs tracking-[0.2em] mt-4">TATTOO PRICE CALCULATOR</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-2xl mx-auto border border-border/40 bg-card/50 backdrop-blur-sm rounded-sm p-8 md:p-12 shadow-[0_0_40px_rgba(139,0,0,0.08)]"
      >
        {/* Step 1: Size */}
        <div className="mb-12">
          <p className="text-foreground text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
            <span className="text-primary font-mono">STEP 01</span> — SIZE
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sizes.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSizeIdx(i)}
                className={`px-5 py-5 border rounded-sm transition-all duration-300 text-center ${
                  sizeIdx === i
                    ? "border-primary bg-primary/10 text-foreground shadow-[0_0_20px_rgba(139,0,0,0.15)]"
                    : "border-border/30 text-foreground/50 hover:border-border/60"
                }`}
              >
                <span className="block text-base tracking-[0.15em]">{s.label}</span>
                <span className="block text-xs text-muted-foreground mt-1">{s.detail}</span>
                <span className="block text-xs text-foreground/40 mt-2">₹{s.price.toLocaleString("en-IN")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Complexity */}
        <motion.div
          animate={sizeIdx !== null ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 10 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-foreground text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
            <span className="text-primary font-mono">STEP 02</span> — COMPLEXITY
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {complexities.map((c, i) => (
              <button
                key={c.label}
                onClick={() => sizeIdx !== null && setComplexIdx(i)}
                disabled={sizeIdx === null}
                className={`px-5 py-5 border rounded-sm transition-all duration-300 text-center ${
                  complexIdx === i
                    ? "border-primary bg-primary/10 text-foreground shadow-[0_0_20px_rgba(139,0,0,0.15)]"
                    : "border-border/30 text-foreground/50 hover:border-border/60 disabled:opacity-20 disabled:cursor-not-allowed"
                }`}
              >
                <span className="block text-base tracking-[0.1em]">{c.label}</span>
                <span className="block text-xs text-foreground/40 mt-2">×{c.multiplier}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 3: Color */}
        <motion.div
          animate={complexIdx !== null ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 10 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-foreground text-sm md:text-base tracking-[0.3em] mb-6 uppercase">
            <span className="text-primary font-mono">STEP 03</span> — COLOR
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {colorOptions.map((c, i) => (
              <button
                key={c.label}
                onClick={() => complexIdx !== null && setColorIdx(i)}
                disabled={complexIdx === null}
                className={`px-5 py-5 border rounded-sm transition-all duration-300 text-center ${
                  colorIdx === i
                    ? "border-primary bg-primary/10 text-foreground shadow-[0_0_20px_rgba(139,0,0,0.15)]"
                    : "border-border/30 text-foreground/50 hover:border-border/60 disabled:opacity-20 disabled:cursor-not-allowed"
                }`}
              >
                <span className="block text-base tracking-[0.1em]">{c.label}</span>
                {c.addition > 0 && (
                  <span className="block text-xs text-foreground/40 mt-2">+₹{c.addition.toLocaleString("en-IN")}</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center border-t border-border/30 pt-10"
          >
            <p className="text-foreground/40 text-xs tracking-[0.4em] mb-3 uppercase">Estimated Range</p>
            <p className="text-4xl md:text-5xl text-foreground tracking-[0.05em] mb-2">
              ₹<AnimatedPrice value={estimate - 1000} /> – ₹<AnimatedPrice value={estimate + 1000} />
            </p>
            <p className="text-muted-foreground text-xs tracking-[0.15em] mb-10">(± ₹1,000 range)</p>

            <a
              href={`https://wa.me/${studioInfo.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary hover:bg-primary/80 text-primary-foreground px-10 py-5 text-sm tracking-[0.25em] uppercase transition-colors duration-300 rounded-sm wa-pulse"
            >
              Consult an Artist via WhatsApp
            </a>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default PriceCalculator;
