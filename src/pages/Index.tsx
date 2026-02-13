import { lazy, Suspense } from "react";
import FilmGrain from "@/components/FilmGrain";
import HeroSection from "@/components/HeroSection";
import CinematicText from "@/components/CinematicText";
import MobileBar from "@/components/MobileBar";
import Chatbot from "@/components/Chatbot";

// Lazy-load everything below the fold for performance
const GallerySection = lazy(() => import("@/components/GallerySection"));
const StyleCategoriesSection = lazy(() => import("@/components/StyleCategoriesSection"));
const PriceCalculator = lazy(() => import("@/components/PriceCalculator"));
const TattooPreview = lazy(() => import("@/components/TattooPreview"));
const ResidentVisionaries = lazy(() => import("@/components/ResidentVisionaries"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const TrustSection = lazy(() => import("@/components/TrustSection"));
const LocationSection = lazy(() => import("@/components/LocationSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const EndingSection = lazy(() => import("@/components/EndingSection"));

const SectionFallback = () => (
  <div className="h-[50vh] flex items-center justify-center">
    <div className="w-6 h-6 border border-primary/40 border-t-primary rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <main className="bg-background">
      <FilmGrain />
      <HeroSection />
      <CinematicText text="INK IS IDENTITY" />
      <CinematicText text="EVERY LINE TELLS A STORY" />
      <Suspense fallback={<SectionFallback />}>
        <GallerySection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <StyleCategoriesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PriceCalculator />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TattooPreview />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ResidentVisionaries />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ProcessSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TrustSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <LocationSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ContactSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <EndingSection />
      </Suspense>
      <MobileBar />
      <Chatbot />
    </main>
  );
};

export default Index;
