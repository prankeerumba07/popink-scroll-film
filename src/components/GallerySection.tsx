import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { galleryImages } from "@/data/media";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const openLightbox = (i: number) => setLightboxIndex(i % galleryImages.length);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % galleryImages.length : null);
  const prevImage = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null);

  // Double images for seamless marquee loop
  const marqueeImages = [...galleryImages, ...galleryImages];

  return (
    <>
      <section ref={ref} className="relative py-14 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-12 px-4"
        >
          <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em]">OUR WORK</h2>
          <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
        </motion.div>

        {isMobile ? (
          /* Mobile: swipe-only, no auto-scroll */
          <div
            className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            {galleryImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex-none w-[80vw] aspect-[3/4] snap-center cursor-pointer group relative overflow-hidden rounded-sm"
                onClick={() => openLightbox(i)}
              >
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/80 to-transparent">
                  <p className="text-[9px] text-foreground/50 tracking-[2px] uppercase">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Desktop: CSS marquee auto-scroll */
          <div className="gallery-marquee-container">
            <div className="gallery-marquee">
              {marqueeImages.map((img, i) => (
                <div
                  key={`${img.id}-${i}`}
                  className="gallery-marquee-item group cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-110"
                  />
                  {/* Dim overlay for non-hovered siblings */}
                  <div className="absolute inset-0 bg-background/0 transition-all duration-[400ms] group-hover:bg-transparent gallery-marquee-container:hover > .gallery-marquee > &:not(:hover) > &:bg-background/15" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/80 to-transparent">
                    <p className="text-[9px] text-foreground/50 tracking-[2px] uppercase">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isMobile && (
          <motion.p
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 3, duration: 1 }}
            className="text-center text-muted-foreground text-xs mt-4 tracking-widest"
          >
            SWIPE TO EXPLORE →
          </motion.p>
        )}
      </section>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-foreground/60 hover:text-foreground z-50">
              <X size={28} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground z-50"
            >
              <ChevronLeft size={36} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground z-50"
            >
              <ChevronRight size={36} />
            </button>
            <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={lightboxIndex}
                src={galleryImages[lightboxIndex % galleryImages.length].src}
                alt={galleryImages[lightboxIndex % galleryImages.length].alt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-[90vw] max-h-[80vh] object-contain"
              />
              <p className="text-[9px] text-foreground/40 tracking-[2px] uppercase mt-4">
                {galleryImages[lightboxIndex % galleryImages.length].caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GallerySection;
