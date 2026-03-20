import { lazy, Suspense } from "react";
import FilmGrain from "@/components/FilmGrain";
import HeroSection from "@/components/HeroSection";
import CinematicText from "@/components/CinematicText";
import MobileBar from "@/components/MobileBar";

// Lazy-load everything below the fold for performance
const GallerySection = lazy(() => import("@/components/GallerySection"));
const StyleCategoriesSection = lazy(() => import("@/components/StyleCategoriesSection"));
const PriceCalculator = lazy(() => import("@/components/PriceCalculator"));
const TattooPreview = lazy(() => import("@/components/TattooPreview"));
const ResidentVisionaries = lazy(() => import("@/components/ResidentVisionaries"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const WhyPopInk = lazy(() => import("@/components/WhyPopInk"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const TrustSection = lazy(() => import("@/components/TrustSection"));
const LocationSection = lazy(() => import("@/components/LocationSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const EndingSection = lazy(() => import("@/components/EndingSection"));
const Chatbot = lazy(() => import("@/components/Chatbot"));

const SectionFallback = () => (
  <div className="h-[30vh] flex items-center justify-center">
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
        <WhyPopInk />
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
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </main>
  );
};

export default Index;
