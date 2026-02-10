// ============================================
// DYNAMIC MEDIA CONFIGURATION
// ============================================
// To add/remove/reorder portfolio items:
// Simply edit the arrays below. No code changes needed elsewhere.
// Layout and animations auto-adjust.

export interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  year?: string;
  caption?: string;
  bgColor: string; // Background color for the section
}

export interface ProcessVideo {
  id: string;
  src: string;
  poster?: string;
  caption?: string;
}

// Portfolio items — add, remove, or reorder freely
// Each item gets a full-viewport section with matching background
export const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    src: "/images/gallery/tattoo-1.jpeg",
    alt: "Tribal back tattoo",
    year: "2024",
    caption: "Custom tribal design",
    bgColor: "#1a1a1a",
  },
  {
    id: "2",
    src: "/images/gallery/tattoo-2.png",
    alt: "Line art arm tattoo",
    year: "2024",
    caption: "Fine line work",
    bgColor: "#2a2018",
  },
  {
    id: "3",
    src: "/images/gallery/tattoo-3.jpeg",
    alt: "Koi fish sleeve tattoo",
    year: "2023",
    caption: "Japanese style sleeve",
    bgColor: "#181a20",
  },
  {
    id: "4",
    src: "/images/gallery/tattoo-4.jpeg",
    alt: "Barong shoulder tattoo",
    year: "2023",
    caption: "Traditional Barong piece",
    bgColor: "#201a18",
  },
];

// Process videos — auto-play muted, loop
export const processVideos: ProcessVideo[] = [
  { id: "v1", src: "/videos/process-video.mp4", caption: "The art of precision" },
];

// Studio info
export const studioInfo = {
  name: "The PopInk Studios",
  tagline: "Where Skin Becomes Art.",
  phone: "+91-9876543210",
  whatsapp: "919876543210",
  email: "hello@thepopinkstudios.com",
  address: "Kolkata, West Bengal, India",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.4!2d88.35!3d22.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM0JzEyLjAiTiA4OMKwMjEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1700000000000",
  socialLinks: {
    google: "https://www.google.com/search?q=the+popink+tattoo+studio",
    instagram: "https://www.instagram.com/the_popink_tattoo_studio/",
    justdial: "https://www.justdial.com/Kolkata/The-Popink-Tattoo-Studio",
  },
};
