import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { studioInfo } from "@/data/media";
import { Star, Instagram, MapPin } from "lucide-react";

const links = [
  { icon: Star, label: "Google Reviews", href: studioInfo.socialLinks.google },
  { icon: Instagram, label: "Instagram", href: studioInfo.socialLinks.instagram },
  { icon: MapPin, label: "JustDial", href: studioInfo.socialLinks.justdial },
];

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="flex justify-center gap-10 md:gap-16"
      >
        {links.map(({ icon: Icon, label, href }, i) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 0.6, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="flex flex-col items-center gap-2 text-foreground/60 hover:text-primary transition-colors duration-500 group"
          >
            <Icon size={24} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xs tracking-[0.2em] uppercase">{label}</span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

export default TrustSection;
