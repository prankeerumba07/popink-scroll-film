import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { studioInfo } from "@/data/media";
import { Instagram, Star, MapPin } from "lucide-react";

const EndingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="relative min-h-[70vh] flex flex-col items-center justify-center py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[hsl(0,0%,2%)]" />

      <div className="relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2 }}
          className="text-4xl md:text-6xl lg:text-7xl text-foreground tracking-[0.2em] mb-12"
        >
          INK WITH INTENTION.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.5 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex justify-center gap-8"
        >
          <a href={studioInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
            className="text-foreground/40 hover:text-primary transition-colors duration-500">
            <Instagram size={20} />
          </a>
          <a href={studioInfo.socialLinks.google} target="_blank" rel="noopener noreferrer"
            className="text-foreground/40 hover:text-primary transition-colors duration-500">
            <Star size={20} />
          </a>
          <a href={studioInfo.socialLinks.justdial} target="_blank" rel="noopener noreferrer"
            className="text-foreground/40 hover:text-primary transition-colors duration-500">
            <MapPin size={20} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 space-y-1"
        >
          <p className="text-muted-foreground text-[10px] tracking-[2px] uppercase">
            {studioInfo.address}
          </p>
          <p className="text-muted-foreground text-[10px] tracking-[2px]">
            {studioInfo.phone}
          </p>
          <p className="text-muted-foreground text-[10px] tracking-[2px]">
            OPEN DAILY — {studioInfo.hours.label}
          </p>
          <p className="text-muted-foreground text-[10px] tracking-[2px] mt-4">
            © {new Date().getFullYear()} THE POPINK STUDIOS
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EndingSection;
