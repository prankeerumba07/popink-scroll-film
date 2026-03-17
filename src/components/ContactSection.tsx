import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { studioInfo } from "@/data/media";
import { Phone, MessageCircle, MapPin, Instagram } from "lucide-react";

const contactCards = [
  {
    icon: Phone,
    label: "CALL US",
    detail: studioInfo.phone,
    href: `tel:${studioInfo.phone}`,
  },
  {
    icon: MessageCircle,
    label: "WHATSAPP",
    detail: "Message us directly",
    href: `https://wa.me/${studioInfo.whatsapp}`,
  },
  {
    icon: MapPin,
    label: "VISIT THE STUDIO",
    detail: studioInfo.address,
    href: `https://www.google.com/maps/search/?api=1&query=22.5089,88.3331`,
  },
  {
    icon: Instagram,
    label: "INSTAGRAM",
    detail: "@the_popink_tattoo_studio",
    href: studioInfo.socialLinks.instagramDM,
  },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section ref={ref} className="relative py-16 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl text-foreground tracking-[0.2em]">
          BOOK YOUR SESSION
        </h2>
        <div className="w-16 h-[1px] bg-primary mx-auto mt-6" />
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactCards.map((card, i) => (
          <motion.a
            key={card.label}
            href={card.href}
            target={card.label === "CALL US" ? undefined : "_blank"}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
            className="group relative block border border-border/40 bg-card/60 backdrop-blur-sm rounded-sm p-8 md:p-10 transition-all duration-500 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(139,0,0,0.15)]"
          >
            <div className="flex items-start gap-5">
              <card.icon
                size={28}
                className="text-primary/70 group-hover:text-primary transition-colors duration-500 mt-1 shrink-0"
              />
              <div>
                <p className="text-foreground text-lg md:text-xl tracking-[0.2em] mb-2">
                  {card.label}
                </p>
                <p className="text-muted-foreground text-sm tracking-[0.1em] leading-relaxed">
                  {card.detail}
                </p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="mt-16 text-center space-y-3"
      >
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          STUDIO HOURS
        </p>
        <p className="text-foreground/70 text-sm tracking-[0.15em]">
          Open Daily
        </p>
        <p className="text-foreground/60 text-sm tracking-[0.1em]">
          {studioInfo.hours.label}
        </p>
        <StudioStatus />
      </motion.div>
    </section>
  );
};

const StudioStatus = () => {
  const now = new Date();
  const kolkataHour = Number(
    new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }).format(now)
  );
  const isOpen = kolkataHour >= 10 && kolkataHour < 23;

  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          isOpen ? 'bg-green-500/80' : 'bg-red-400/50'
        }`}
      />
      <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
        {isOpen ? 'OPEN NOW' : 'CLOSED'}
      </span>
    </div>
  );
};

export default ContactSection;
