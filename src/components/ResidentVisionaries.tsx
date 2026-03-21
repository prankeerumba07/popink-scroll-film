import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ArtistModal, { type ArtistProfile } from "./ArtistModal";
import { studioInfo } from "@/data/media";

const artists: ArtistProfile[] = [
  {
    name: "ARTIST ONE",
    role: "Lead Tattoo Artist",
    specialty: "Hyper-Realism & Portraits",
    years: "8+ Years",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    bio: "A masterful ink artist with over 8 years of experience transforming skin into living canvases. Trained under some of the finest realism artists in India, Artist One brings an obsessive attention to detail and an almost photographic precision to every portrait and hyper-realistic piece.",
    philosophy: "Every tattoo is a covenant between artist and canvas. I don't just replicate images — I breathe life into them. The skin remembers, and my job is to make that memory extraordinary.",
    signatureStyle: "Known for dramatic light-and-shadow interplay in portrait work, using micro-detail layering to achieve a three-dimensional depth that seems to pulse beneath the skin.",
    tags: ["Hyper-Realism", "Portraits", "Black & Grey", "Memorial Art"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&q=80",
      "https://images.unsplash.com/photo-1590246815117-0b5fbf67f78d?w=400&q=80",
      "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&q=80",
      "https://images.unsplash.com/photo-1598371839696-5c5bb1fed6e2?w=400&q=80",
      "https://images.unsplash.com/photo-1567400358520-44e220972306?w=400&q=80",
      "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=400&q=80",
    ],
    portfolioHighlights: [
      "500+ portrait tattoos completed",
      "Featured in Kolkata Ink Festival 2023",
      "Specialist in memorial and tribute portraits",
      "Expert in black-and-grey realism with color accent techniques",
    ],
  },
  {
    name: "ARTIST TWO",
    role: "Resident Ink Architect",
    specialty: "Geometric & Blackwork",
    years: "6+ Years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    bio: "An architect of ink who sees the body as a three-dimensional structure to be adorned with precision-engineered patterns. With 6+ years of dedicated practice, Artist Two has developed a signature approach that merges sacred geometry with contemporary blackwork aesthetics.",
    philosophy: "Mathematics is the language of the universe, and geometry is its art. I use the body's natural contours as guidelines, creating designs that flow with anatomy rather than fighting it.",
    signatureStyle: "Precision-engineered geometric patterns that wrap and flow with the body's natural musculature, combining dot-work gradients with bold blackwork structures.",
    tags: ["Blackwork", "Geometric", "Sacred Geometry", "Dot-work"],
    portfolioImages: [
      "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=400&q=80",
      "https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?w=400&q=80",
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&q=80",
      "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&q=80",
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&q=80",
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&q=80",
    ],
    portfolioHighlights: [
      "Pioneered 'Architectural Blackwork' technique locally",
      "Full sleeve geometric compositions specialist",
      "Sacred geometry and mandala expert",
      "Dot-work gradient master — seamless fade techniques",
    ],
  },
  {
    name: "ARTIST THREE",
    role: "Fine-Line Specialist",
    specialty: "Minimalist & Script",
    years: "5+ Years",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    bio: "The studio's precision specialist with 5+ years dedicated to the art of restraint. Artist Three proves that sometimes the most powerful statement is the quietest one — a single, perfect line that carries the weight of an entire story.",
    philosophy: "Less is more, but only when that 'less' is absolutely perfect. A fine line has no room for error. Every stroke must be intentional, every curve deliberate. That's where the beauty lives.",
    signatureStyle: "Ultra-fine single-needle work creating delicate, almost ethereal designs that age gracefully. Known for script work that reads like calligraphy and minimalist designs that feel like whispered secrets.",
    tags: ["Fine Line", "Minimalist", "Script", "Botanical"],
    portfolioHighlights: [
      "Single-needle fine-line specialist",
      "Custom hand-lettered script designs",
      "Botanical and floral minimalism expert",
      "Micro-tattoo precision work — designs under 1 inch",
    ],
  },
];

const ResidentVisionaries = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const [selectedArtist, setSelectedArtist] = useState<ArtistProfile | null>(null);

  return (
    <>
      <section ref={ref} className="relative py-16 px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12"
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
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
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
                <p className="text-foreground/30 text-[10px] tracking-[0.15em] uppercase mb-3">
                  {artist.specialty}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedArtist(artist)}
                    className="text-[10px] text-primary tracking-[0.25em] uppercase border border-primary/30 hover:border-primary hover:bg-primary/10 px-4 py-2 rounded-sm transition-all duration-300"
                  >
                    Learn More
                  </button>
                  <a
                    href={`https://wa.me/${studioInfo.whatsapp}?text=${encodeURIComponent(`Hi PopInk, I'd like to book a consultation with ${artist.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-primary-foreground tracking-[0.25em] uppercase bg-primary/80 hover:bg-primary px-4 py-2 rounded-sm transition-all duration-300"
                  >
                    Book
                  </a>
                </div>
              </div>

              {/* Hover border glow */}
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-colors duration-500 rounded-sm pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </section>

      <ArtistModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />
    </>
  );
};

export default ResidentVisionaries;
