import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Artist {
  name: string;
  role: string;
  specialty: string;
  years: string;
  image: string;
}

const artists: Artist[] = [
  {
    name: "ARTIST ONE",
    role: "Lead Tattoo Artist",
    specialty: "Hyper-Realism & Portraits",
    years: "8+ Years",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  },
  {
    name: "ARTIST TWO",
    role: "Resident Ink Architect",
    specialty: "Geometric & Blackwork",
    years: "6+ Years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    name: "ARTIST THREE",
    role: "Fine-Line Specialist",
    specialty: "Minimalist & Script",
    years: "5+ Years",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  },
];

const ResidentVisionaries = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section ref={ref} className="relative py-28 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl text-foreground tracking-[0.2em]">
          RESIDENT VISIONARIES
        </h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
        <p className="text-muted-foreground text-xs tracking-[0.2em] mt-4">
          THE ARCHITECTS OF INK
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {artists.map((artist, i) => (
          <motion.div
            key={artist.name}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className="group relative overflow-hidden rounded-sm border border-border/20 bg-card/30 backdrop-blur-sm"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={artist.image}
                alt={artist.name}
                loading="lazy"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-110"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              {/* Red glow on hover */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[10px] text-primary tracking-[0.3em] uppercase mb-1">
                {artist.years}
              </p>
              <h3 className="text-xl text-foreground tracking-[0.15em] mb-1">
                {artist.name}
              </h3>
              <p className="text-foreground/60 text-xs tracking-[0.1em] mb-1">
                {artist.role}
              </p>
              <p className="text-foreground/30 text-[10px] tracking-[0.15em] uppercase">
                {artist.specialty}
              </p>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-colors duration-500 rounded-sm pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ResidentVisionaries;
