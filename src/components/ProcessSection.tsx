import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { processVideos } from "@/data/media";

const CurtainVideo = ({ video, index }: { video: typeof processVideos[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const clipTop = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const clipPath = useTransform(clipTop, (v) => `inset(${v}% 0 ${v}% 0)`);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ clipPath, opacity }}
      className="relative overflow-hidden rounded-sm"
    >
      <video autoPlay muted loop playsInline className="w-full aspect-video object-cover">
        <source src={video.src} type="video/mp4" />
      </video>
      {video.caption && (
        <p className="text-center text-muted-foreground text-sm tracking-[0.2em] mt-4 tagline-word italic">
          {video.caption}
        </p>
      )}
    </motion.div>
  );
};

const ProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="relative py-20 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl text-foreground tracking-[0.2em]">THE PROCESS</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-16">
        {processVideos.map((video, i) => (
          <CurtainVideo key={video.id} video={video} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ProcessSection;
