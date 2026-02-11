import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FilmGrain from "@/components/FilmGrain";
import ScrollEngine from "@/components/ScrollEngine";
import HeroSection from "@/components/HeroSection";
import CinematicText from "@/components/CinematicText";
import GallerySection from "@/components/GallerySection";
import ProcessSection from "@/components/ProcessSection";
import AboutSection from "@/components/AboutSection";
import TrustSection from "@/components/TrustSection";
import LocationSection from "@/components/LocationSection";
import EndingSection from "@/components/EndingSection";
import MobileBar from "@/components/MobileBar";

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Background color floods: black → charcoal → black
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.6, 0.85, 1],
    [
      "hsl(0, 0%, 4%)",    // hero - pure dark
      "hsl(0, 0%, 7%)",    // cinematic text - slightly lighter
      "hsl(0, 0%, 10%)",   // gallery - charcoal flood
      "hsl(0, 0%, 7%)",    // process/about
      "hsl(0, 0%, 5%)",    // location
      "hsl(0, 0%, 2%)",    // ending - deepest black
    ]
  );

  return (
    <motion.main ref={mainRef} style={{ backgroundColor: bgColor }}>
      <ScrollEngine />
      <FilmGrain />
      <HeroSection />
      <CinematicText text="INK IS IDENTITY" />
      <CinematicText text="EVERY LINE TELLS A STORY" />
      <GallerySection />
      <ProcessSection />
      <AboutSection />
      <TrustSection />
      <LocationSection />
      <EndingSection />
      <MobileBar />
    </motion.main>
  );
};

export default Index;
