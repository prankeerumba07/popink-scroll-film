import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const taglineWords = ["Where", "Skin", "Becomes", "Art."];

const HeroSection = () => {
  const [showContent, setShowContent] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 800);
    const t2 = setTimeout(() => setShowTagline(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Hero Video */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/logo.jpeg"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
            {/* Base overlay */}
            <div className="absolute inset-0 bg-background/40" />
            {/* Cinematic vignette — gradient edges blending into black background */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `
                radial-gradient(ellipse at center, transparent 50%, hsl(var(--background) / 0.6) 85%, hsl(var(--background)) 100%),
                linear-gradient(to top, hsl(var(--background)) 0%, transparent 15%),
                linear-gradient(to bottom, hsl(var(--background) / 0.5) 0%, transparent 10%)
              `
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <AnimatePresence>
          {showContent && (
            <motion.img
              src="/images/logo.jpeg"
              alt="The PopInk Studios"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
              className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover mb-8 shadow-[0_0_60px_rgba(139,0,0,0.3)]"
            />
          )}
        </AnimatePresence>

        {/* Tagline word-by-word */}
        <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-4">
          {showTagline &&
            taglineWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.35, ease: "easeOut" }}
                className="tagline-word text-2xl md:text-4xl lg:text-5xl text-foreground"
              >
                {word}
              </motion.span>
            ))}
        </div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-foreground/30 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
