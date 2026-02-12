import { useState, useRef } from "react";
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

  const step = sizeIdx === null ? 1 : complexIdx === null ? 2 : 3;

  return (
    <section ref={ref} className="relative py-24 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em]">ESTIMATE</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
        <p className="text-muted-foreground text-xs tracking-[0.2em] mt-4">TATTOO PRICE CALCULATOR</p>
      </motion.div>

      <div className="max-w-lg mx-auto">
        {/* Step 1: Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <p className="text-foreground/40 text-xs tracking-[0.3em] mb-4 uppercase">
            <span className="text-primary/60 font-mono">01</span> — Size
          </p>
          <div className="space-y-2">
            {sizes.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setSizeIdx(i)}
                className={`w-full text-left px-5 py-4 border rounded-sm transition-all duration-300 ${
                  sizeIdx === i
                    ? "border-primary/60 bg-primary/5 text-foreground"
                    : "border-border/30 text-foreground/50 hover:border-border/60"
                }`}
              >
                <span className="text-sm tracking-[0.1em]">{s.label}</span>
                <span className="text-xs text-muted-foreground ml-2">({s.detail})</span>
                <span className="float-right text-xs text-foreground/40">₹{s.price.toLocaleString("en-IN")}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Complexity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView && sizeIdx !== null ? { opacity: 1, y: 0 } : { opacity: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10"
        >
          <p className="text-foreground/40 text-xs tracking-[0.3em] mb-4 uppercase">
            <span className="text-primary/60 font-mono">02</span> — Complexity
          </p>
          <div className="space-y-2">
            {complexities.map((c, i) => (
              <button
                key={c.label}
                onClick={() => sizeIdx !== null && setComplexIdx(i)}
                disabled={sizeIdx === null}
                className={`w-full text-left px-5 py-4 border rounded-sm transition-all duration-300 ${
                  complexIdx === i
                    ? "border-primary/60 bg-primary/5 text-foreground"
                    : "border-border/30 text-foreground/50 hover:border-border/60 disabled:opacity-30 disabled:cursor-not-allowed"
                }`}
              >
                <span className="text-sm tracking-[0.1em]">{c.label}</span>
                <span className="float-right text-xs text-foreground/40">×{c.multiplier}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 3: Color */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView && complexIdx !== null ? { opacity: 1, y: 0 } : { opacity: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <p className="text-foreground/40 text-xs tracking-[0.3em] mb-4 uppercase">
            <span className="text-primary/60 font-mono">03</span> — Color
          </p>
          <div className="space-y-2">
            {colorOptions.map((c, i) => (
              <button
                key={c.label}
                onClick={() => complexIdx !== null && setColorIdx(i)}
                disabled={complexIdx === null}
                className={`w-full text-left px-5 py-4 border rounded-sm transition-all duration-300 ${
                  colorIdx === i
                    ? "border-primary/60 bg-primary/5 text-foreground"
                    : "border-border/30 text-foreground/50 hover:border-border/60 disabled:opacity-30 disabled:cursor-not-allowed"
                }`}
              >
                <span className="text-sm tracking-[0.1em]">{c.label}</span>
                {c.addition > 0 && (
                  <span className="float-right text-xs text-foreground/40">+₹{c.addition.toLocaleString("en-IN")}</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-foreground/40 text-xs tracking-[0.3em] mb-2 uppercase">Estimated</p>
            <p className="text-3xl md:text-4xl text-foreground tracking-[0.1em] mb-1">
              ₹{(estimate - 1000).toLocaleString("en-IN")} – ₹{(estimate + 1000).toLocaleString("en-IN")}
            </p>
            <p className="text-muted-foreground text-xs tracking-[0.15em] mb-8">(± ₹1,000 range)</p>

            <a
              href={`https://wa.me/${studioInfo.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-sm tracking-[0.2em] uppercase transition-colors duration-300 rounded-sm"
            >
              Consult an Artist via WhatsApp
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PriceCalculator;
