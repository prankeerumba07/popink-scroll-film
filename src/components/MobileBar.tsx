import { Phone, MessageCircle, Navigation } from "lucide-react";
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
        <a href={`https://www.google.com/maps/search/?api=1&query=22.5123953,88.3280544`} target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-foreground/70 hover:text-primary transition-colors">
          <Navigation size={18} />
          <span className="text-[10px] tracking-[0.15em] uppercase">Directions</span>
        </a>
      </div>
    </div>
  );
};

export default MobileBar;
