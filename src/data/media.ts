// ============================================
// DYNAMIC MEDIA CONFIGURATION
// ============================================

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string; // Format: "YEAR — SUBJECT — TECHNIQUE"
}

export interface ProcessVideo {
  id: string;
  src: string;
  poster?: string;
  caption?: string;
}

// Gallery images — add, remove, or reorder freely
export const galleryImages: GalleryImage[] = [
  { id: "1", src: "/images/gallery/tattoo-1.jpeg", alt: "Tribal back tattoo", caption: "2024 — ANATOMICAL FRAGMENT — MICRO-REALISM" },
  { id: "2", src: "/images/gallery/tattoo-2.png", alt: "Line art arm tattoo", caption: "2025 — KINETIC FLOW — CYBER-SIGILISM" },
  { id: "3", src: "/images/gallery/tattoo-3.jpeg", alt: "Koi fish sleeve tattoo", caption: "2024 — ARCHITECTURAL GEOMETRY — BLACKWORK" },
  { id: "4", src: "/images/gallery/tattoo-4.jpeg", alt: "Barong shoulder tattoo", caption: "2025 — BOTANICAL STUDY — FINE-LINE" },
];

// Process videos — auto-play muted, loop
export const processVideos: ProcessVideo[] = [
  { id: "v1", src: "/videos/process-video.mp4", caption: "The art of precision" },
];

// Studio info
export const studioInfo = {
  name: "The PopInk Studios",
  tagline: "Where Skin Becomes Art.",
  phone: "8420523235",
  whatsapp: "918420523235",
  email: "hello@thepopinkstudios.com",
  address: "Triangular Park, 19/4, Plot No 141, Sahapur, New Alipore, Kolkata, West Bengal 700053",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.5!2d88.3315!3d22.5125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDMwJzQ1LjAiTiA4OMKwMTknNTMuNCJF!5e0!3m2!1sen!2sin!4v1700000000000",
  socialLinks: {
    google: "https://www.google.com/search?q=the+popink+tattoo+studio",
    instagram: "https://www.instagram.com/the_popink_tattoo_studio/",
    instagramDM: "https://ig.me/m/the_popink_tattoo_studio",
    justdial: "https://www.justdial.com/Kolkata/The-Popink-Tattoo-Studio",
  },
  hours: {
    open: 10,
    close: 23,
    label: "10:00 AM – 11:00 PM",
    daily: true,
  },
};
