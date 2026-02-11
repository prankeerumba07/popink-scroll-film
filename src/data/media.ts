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
  year?: string;
  artist?: string;
  subject?: string;
  style?: string;
}

export interface ProcessVideo {
  id: string;
  src: string;
  poster?: string;
  caption?: string;
}

// Gallery images — add, remove, or reorder freely
export const galleryImages: GalleryImage[] = [
  { id: "1", src: "/images/gallery/tattoo-1.jpeg", alt: "Tribal back tattoo", year: "2025", artist: "PopInk", subject: "Back piece", style: "Tribal" },
  { id: "2", src: "/images/gallery/tattoo-2.png", alt: "Line art arm tattoo", year: "2025", artist: "PopInk", subject: "Arm sleeve", style: "Line Art" },
  { id: "3", src: "/images/gallery/tattoo-3.jpeg", alt: "Koi fish sleeve tattoo", year: "2024", artist: "PopInk", subject: "Full sleeve", style: "Japanese" },
  { id: "4", src: "/images/gallery/tattoo-4.jpeg", alt: "Barong shoulder tattoo", year: "2024", artist: "PopInk", subject: "Shoulder", style: "Balinese" },
];

// Process videos — auto-play muted, loop
export const processVideos: ProcessVideo[] = [
  { id: "v1", src: "/videos/process-video.mp4", caption: "The art of precision" },
];

// Studio info
export const studioInfo = {
  name: "The PopInk Studios",
  tagline: "Where Skin Becomes Art.",
  phone: "+91-8420523235",
  whatsapp: "918420523235",
  email: "hello@thepopinkstudios.com",
  address: "Triangular Park, 19/4, Plot No 141, Sahapur, New Alipore, Kolkata, West Bengal 700053",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.5!2d88.33!3d22.51!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027125ea3f4b1b%3A0x6e9f1b3b2d5c7e8a!2sTriangular%20Park%2C%20New%20Alipore%2C%20Kolkata!5e0!3m2!1sen!2sin!4v1700000000000",
  socialLinks: {
    google: "https://www.google.com/search?q=the+popink+tattoo+studio",
    instagram: "https://ig.me/m/the_popink_tattoo_studio",
    justdial: "https://www.justdial.com/Kolkata/The-Popink-Tattoo-Studio",
  },
};
