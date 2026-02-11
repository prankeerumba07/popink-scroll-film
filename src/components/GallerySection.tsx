import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { galleryImages } from "@/data/media";
import { useIsMobile } from "@/hooks/use-mobile";

const GallerySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const isMobile = useIsMobile();

  // Stack order: array of indices, last = top of stack
  const [stack, setStack] = useState<number[]>(() =>
    galleryImages.map((_, i) => i)
  );

  // Mouse-follow with spring physics (lerp/inertia)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.8 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) * 0.08);
      mouseY.set((e.clientY - cy) * 0.08);
    },
    [isMobile, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Click → send top card to back
  const cycleCard = useCallback(() => {
    setStack((prev) => {
      const top = prev[prev.length - 1];
      return [top, ...prev.slice(0, -1)];
    });
  }, []);

  // Mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) cycleCard();
    setTouchStart(null);
  };

  // Current top image index
  const topIndex = stack[stack.length - 1];
  const topImage = galleryImages[topIndex];

  // Counter formatted: 0001 / 0004
  const currentNum = String(topIndex + 1).padStart(4, "0");
  const totalNum = String(galleryImages.length).padStart(4, "0");

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-8 px-4"
      >
        <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em]">
          OUR WORK
        </h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
      </motion.div>

      {/* Stacked card pile */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative w-[85vw] max-w-[480px] aspect-[3/4] cursor-pointer"
        onClick={cycleCard}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="popLayout">
          {stack.map((imgIndex, stackPos) => {
            const img = galleryImages[imgIndex];
            const distFromTop = stack.length - 1 - stackPos;
            const isTop = distFromTop === 0;

            // Offsets for stacked look
            const offsetX = distFromTop * 6;
            const offsetY = distFromTop * -4;
            const rotate = distFromTop * 1.5 * (distFromTop % 2 === 0 ? 1 : -1);
            const scale = 1 - distFromTop * 0.03;

            return (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9, rotate: rotate + 10 }}
                animate={{
                  opacity: Math.max(0, 1 - distFromTop * 0.15),
                  scale,
                  rotate,
                  x: offsetX,
                  y: offsetY,
                  zIndex: stackPos,
                }}
                exit={{ opacity: 0, scale: 0.85, y: 40, rotate: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                }}
                style={{
                  x: isTop ? springX : offsetX,
                  y: isTop ? springY : offsetY,
                }}
                className="absolute inset-0 rounded-sm overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover select-none"
                />
                {/* Subtle dark overlay on non-top cards */}
                {!isTop && (
                  <div className="absolute inset-0 bg-background/40" />
                )}
                {/* Grain on hover for top card */}
                {isTop && (
                  <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Labels under the image */}
      <motion.div
        key={topIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 text-center"
      >
        {topImage.year && (
          <p className="text-muted-foreground text-[11px] tracking-[0.3em] uppercase">
            {topImage.year}
            {topImage.artist && <> &mdash; {topImage.artist}</>}
            {topImage.subject && <> &mdash; {topImage.subject}</>}
          </p>
        )}
        {topImage.style && (
          <p className="text-muted-foreground/60 text-[10px] tracking-[0.25em] uppercase mt-1">
            {topImage.style}
          </p>
        )}
      </motion.div>

      {/* Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.4 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-8 right-8 text-muted-foreground text-xs tracking-[0.2em] font-mono"
      >
        {currentNum} / {totalNum}
      </motion.div>

      {/* Mobile swipe hint */}
      {isMobile && (
        <motion.p
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="text-center text-muted-foreground text-xs mt-6 tracking-widest"
        >
          TAP TO EXPLORE →
        </motion.p>
      )}
    </section>
  );
};

export default GallerySection;
