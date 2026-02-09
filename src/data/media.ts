// ============================================
// DYNAMIC MEDIA CONFIGURATION
// ============================================
// To add/remove/reorder gallery images or videos:
// Simply edit the arrays below. No code changes needed elsewhere.
// Layout and animations auto-adjust.

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface ProcessVideo {
  id: string;
  src: string;
  poster?: string;
  caption?: string;
}

// Gallery images — add, remove, or reorder freely
export const galleryImages: GalleryImage[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=1200&q=80", alt: "Tattoo artwork 1" },
  { id: "2", src: "https://images.unsplash.com/photo-1590246815117-c504e16a906d?w=1200&q=80", alt: "Tattoo artwork 2" },
  { id: "3", src: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=1200&q=80", alt: "Tattoo artwork 3" },
  { id: "4", src: "https://images.unsplash.com/photo-1542556398-95fb5b9f9b48?w=1200&q=80", alt: "Tattoo artwork 4" },
  { id: "5", src: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=1200&q=80", alt: "Tattoo artwork 5" },
  { id: "6", src: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=1200&q=80", alt: "Tattoo artwork 6" },
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
