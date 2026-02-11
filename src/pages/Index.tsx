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
  return (
    <main className="bg-background">
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
    </main>
  );
};

export default Index;
