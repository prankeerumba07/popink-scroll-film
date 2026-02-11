import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { studioInfo } from "@/data/media";
import { Phone, MessageCircle, Instagram } from "lucide-react";

const LocationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="relative py-20 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em]">FIND US</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
      </motion.div>

      {/* Dark-mode styled map */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-4xl mx-auto overflow-hidden rounded-sm"
      >
        <iframe
          src={studioInfo.mapEmbedUrl}
          width="100%"
          height="350"
          style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(1.1)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Studio Location"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center text-muted-foreground text-sm tracking-[0.12em] mt-6 max-w-md mx-auto"
      >
        {studioInfo.address}
      </motion.p>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="flex flex-wrap justify-center gap-4 mt-10"
      >
        <a
          href={`tel:${studioInfo.phone}`}
          className="flex items-center gap-2 px-6 py-3 border border-border rounded-sm text-foreground/70 hover:text-primary hover:border-primary transition-colors duration-500 text-sm tracking-[0.15em] uppercase"
        >
          <Phone size={16} />
          Call Us
        </a>
        <a
          href={`https://wa.me/${studioInfo.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 border border-border rounded-sm text-foreground/70 hover:text-primary hover:border-primary transition-colors duration-500 text-sm tracking-[0.15em] uppercase"
        >
          <MessageCircle size={16} />
          WhatsApp Us
        </a>
        <a
          href={studioInfo.socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 border border-border rounded-sm text-foreground/70 hover:text-primary hover:border-primary transition-colors duration-500 text-sm tracking-[0.15em] uppercase"
        >
          <Instagram size={16} />
          Instagram
        </a>
      </motion.div>
    </section>
  );
};

export default LocationSection;
