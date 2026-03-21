import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Rahul S.", text: "Absolutely incredible work! The detail in my sleeve is unreal. Best studio in Kolkata, hands down.", source: "Google" },
  { name: "Priya M.", text: "Got my first tattoo here and they made me so comfortable. The fine-line work is perfection.", source: "Google" },
  { name: "Arjun K.", text: "The hyper-realism portrait they did for me looks like a photograph on my skin. Mind-blowing artists.", source: "JustDial" },
  { name: "Sneha D.", text: "Clean studio, professional artists, and the aftercare guidance was top-notch. Highly recommend PopInk!", source: "Google" },
  { name: "Vikram R.", text: "Got a geometric sleeve done here. The precision and symmetry is insane. Worth every rupee.", source: "JustDial" },
  { name: "Ananya B.", text: "They turned my idea into something way better than I imagined. True artists who care about their craft.", source: "Google" },
];

// Double for seamless loop
const marqueeReviews = [...reviews, ...reviews];

const ClientReviews = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative py-14 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-10 px-4"
      >
        <p className="text-primary/60 text-[10px] tracking-[0.4em] uppercase mb-3">What Our Clients Say</p>
        <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em]">CLIENT EXPERIENCES</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
      </motion.div>

      <div className="reviews-marquee-container">
        <div className="reviews-marquee">
          {marqueeReviews.map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              className="reviews-marquee-item group"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed mb-4 italic">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <p className="text-foreground/90 text-xs tracking-[0.15em] uppercase">{review.name}</p>
                <p className="text-muted-foreground text-[10px] tracking-[0.1em]">{review.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientReviews;
