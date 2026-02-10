import { useEffect, useState } from "react";
import { studioInfo } from "@/data/media";

const BottomBar = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setScrollPercent(percent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 text-xs tracking-[0.15em]"
      style={{ color: "rgba(255,255,255,0.5)", backgroundColor: "transparent" }}
    >
      <span>{scrollPercent}%</span>
      <span className="uppercase tracking-[0.2em]">{studioInfo.name}</span>
      <a
        href={studioInfo.socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-100 transition-opacity"
      >
        Info
      </a>
    </div>
  );
};

export default BottomBar;
