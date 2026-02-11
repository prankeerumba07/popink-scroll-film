import { Phone, MessageCircle, Instagram } from "lucide-react";
import { studioInfo } from "@/data/media";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileBar = () => {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border">
      <div className="flex justify-around items-center py-3">
        <a href={`tel:${studioInfo.phone}`} className="flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-colors">
          <Phone size={18} />
          <span className="text-[10px] tracking-[0.15em] uppercase">Call</span>
        </a>
        <a href={`https://wa.me/${studioInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-colors">
          <MessageCircle size={18} />
          <span className="text-[10px] tracking-[0.15em] uppercase">WhatsApp</span>
        </a>
        <a href={studioInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-colors">
          <Instagram size={18} />
          <span className="text-[10px] tracking-[0.15em] uppercase">Instagram</span>
        </a>
      </div>
    </div>
  );
};

export default MobileBar;
