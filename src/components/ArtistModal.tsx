import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { studioInfo } from "@/data/media";
import { useEffect } from "react";

export interface ArtistProfile {
  name: string;
  role: string;
  specialty: string;
  years: string;
  image: string;
  bio: string;
  philosophy: string;
  signatureStyle: string;
  tags?: string[];
  portfolioHighlights: string[];
}

interface Props {
  artist: ArtistProfile | null;
  onClose: () => void;
}

const ArtistModal = ({ artist, onClose }: Props) => {
  useEffect(() => {
    if (artist) {
      document.body.style.overflow = "hidden";
      const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handler);
      return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
    }
  }, [artist, onClose]);

  return (
    <AnimatePresence>
      {artist && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border/30 bg-card/80 backdrop-blur-md rounded-sm shadow-[0_0_80px_rgba(139,0,0,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>

            {/* Portrait */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] text-primary tracking-[0.3em] uppercase mb-1">{artist.years}</p>
                <h3 className="text-2xl md:text-3xl text-foreground tracking-[0.15em]">{artist.name}</h3>
                <p className="text-foreground/60 text-sm tracking-[0.1em]">{artist.role}</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Specialty Tags */}
              {artist.tags && artist.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {artist.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-[10px] tracking-[0.15em] uppercase border border-primary/30 text-primary/80 rounded-sm bg-primary/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-3">Biography</p>
                <p className="text-foreground/70 text-sm leading-relaxed">{artist.bio}</p>
              </div>

              <div>
                <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-3">Artistic Philosophy</p>
                <p className="text-foreground/70 text-sm leading-relaxed italic">"{artist.philosophy}"</p>
              </div>

              <div>
                <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-3">Signature Style</p>
                <p className="text-foreground/70 text-sm leading-relaxed">{artist.signatureStyle}</p>
              </div>

              <div>
                <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-3">Portfolio Highlights</p>
                <div className="space-y-2">
                  {artist.portfolioHighlights.map((h, i) => (
                    <p key={i} className="text-foreground/50 text-xs tracking-[0.1em] flex items-start gap-2">
                      <span className="text-primary mt-0.5">◆</span> {h}
                    </p>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href={`https://wa.me/${studioInfo.whatsapp}?text=${encodeURIComponent(`Hi PopInk Studios! I'd like to book a consultation with ${artist.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-sm tracking-[0.25em] uppercase transition-colors duration-300 rounded-sm wa-pulse"
              >
                Book Consultation
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArtistModal;
