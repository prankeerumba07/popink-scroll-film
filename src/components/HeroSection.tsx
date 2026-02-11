import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const taglineWords = ["Where", "Skin", "Becomes", "Art."];

const HeroSection = () => {
  const [showContent, setShowContent] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 800);
    const t2 = setTimeout(() => setShowTagline(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-background">
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
            style={{ scale: videoScale, opacity: videoOpacity }}
          >
            <video
              autoPlay muted loop playsInline preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-background/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: contentOpacity }}
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
