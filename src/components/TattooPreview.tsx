import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Upload, RotateCw, Maximize2, Minimize2, Download, Trash2 } from "lucide-react";
import { galleryImages } from "@/data/media";

interface Position {
  x: number;
  y: number;
}

const TattooPreview = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [selectedTattoo, setSelectedTattoo] = useState<string | null>(null);
  const [tattooPos, setTattooPos] = useState<Position>({ x: 150, y: 150 });
  const [tattooSize, setTattooSize] = useState(120);
  const [tattooRotation, setTattooRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const bodyInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleBodyUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBodyImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const getEventPos = (e: React.TouchEvent | React.MouseEvent): Position => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent) => {
    const pos = getEventPos(e);
    const dx = pos.x - tattooPos.x;
    const dy = pos.y - tattooPos.y;
    if (Math.sqrt(dx * dx + dy * dy) < tattooSize) {
      setIsDragging(true);
      setDragOffset({ x: dx, y: dy });
    }
  };

  const handlePointerMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const pos = getEventPos(e);
    setTattooPos({ x: pos.x - dragOffset.x, y: pos.y - dragOffset.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  // Render to canvas for export
  const exportImage = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !bodyImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bodyImg = new Image();
    bodyImg.crossOrigin = "anonymous";
    bodyImg.onload = () => {
      canvas.width = bodyImg.width;
      canvas.height = bodyImg.height;
      ctx.drawImage(bodyImg, 0, 0);

      if (selectedTattoo) {
        const tattooImg = new Image();
        tattooImg.crossOrigin = "anonymous";
        tattooImg.onload = () => {
          const scaleX = bodyImg.width / container.clientWidth;
          const scaleY = bodyImg.height / container.clientHeight;
          const cx = tattooPos.x * scaleX;
          const cy = tattooPos.y * scaleY;
          const sz = tattooSize * scaleX;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((tattooRotation * Math.PI) / 180);
          ctx.drawImage(tattooImg, -sz / 2, -sz / 2, sz, sz);
          ctx.restore();

          const link = document.createElement("a");
          link.download = "popink-tattoo-preview.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        };
        tattooImg.src = selectedTattoo;
      }
    };
    bodyImg.src = bodyImage;
  }, [bodyImage, selectedTattoo, tattooPos, tattooSize, tattooRotation]);

  // Size/placement tips
  const tips = [];
  if (tattooSize < 60) tips.push("Very small — may lose detail over time");
  if (tattooSize > 200) tips.push("Large piece — consider multiple sessions");
  if (tattooPos.y < 50) tips.push("High placement — visible in most clothing");

  return (
    <section ref={sectionRef} className="relative py-28 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl md:text-6xl text-foreground tracking-[0.2em]">PREVIEW</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
        <p className="text-muted-foreground text-xs tracking-[0.2em] mt-4">
          VISUALIZE YOUR TATTOO
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        {/* Upload area */}
        {!bodyImage ? (
          <div className="border border-dashed border-border/40 rounded-sm p-12 text-center">
            <p className="text-foreground/50 text-sm tracking-[0.15em] mb-6">
              Upload a photo of the body area or take one with your camera
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => bodyInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 border border-border/40 text-foreground/60 hover:text-foreground hover:border-primary/40 transition-colors text-xs tracking-[0.2em] uppercase rounded-sm"
              >
                <Upload size={16} /> Upload
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-primary-foreground transition-colors text-xs tracking-[0.2em] uppercase rounded-sm"
              >
                <Camera size={16} /> Camera
              </button>
            </div>
            <input ref={bodyInputRef} type="file" accept="image/*" className="hidden" onChange={handleBodyUpload} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleBodyUpload} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview canvas */}
            <div
              ref={containerRef}
              className="relative w-full aspect-[3/4] max-h-[70vh] bg-card/50 border border-border/20 rounded-sm overflow-hidden cursor-crosshair select-none touch-none"
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            >
              <img src={bodyImage} alt="Body" className="w-full h-full object-contain" />

              {selectedTattoo && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: tattooPos.x - tattooSize / 2,
                    top: tattooPos.y - tattooSize / 2,
                    width: tattooSize,
                    height: tattooSize,
                    transform: `rotate(${tattooRotation}deg)`,
                  }}
                >
                  <img
                    src={selectedTattoo}
                    alt="Tattoo overlay"
                    className="w-full h-full object-contain opacity-85 mix-blend-multiply"
                    draggable={false}
                  />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Minimize2 size={14} className="text-foreground/40" />
                <input
                  type="range"
                  min={40}
                  max={300}
                  value={tattooSize}
                  onChange={(e) => setTattooSize(Number(e.target.value))}
                  className="w-28 accent-[hsl(var(--primary))]"
                />
                <Maximize2 size={14} className="text-foreground/40" />
              </div>
              <div className="flex items-center gap-2">
                <RotateCw size={14} className="text-foreground/40" />
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={tattooRotation}
                  onChange={(e) => setTattooRotation(Number(e.target.value))}
                  className="w-28 accent-[hsl(var(--primary))]"
                />
              </div>
              <button
                onClick={exportImage}
                disabled={!selectedTattoo}
                className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors disabled:opacity-30"
              >
                <Download size={14} /> Save
              </button>
              <button
                onClick={() => { setBodyImage(null); setSelectedTattoo(null); }}
                className="flex items-center gap-1 px-4 py-2 border border-border/30 text-foreground/50 hover:text-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors"
              >
                <Trash2 size={14} /> Reset
              </button>
            </div>

            {/* Tips */}
            {tips.length > 0 && (
              <div className="text-center space-y-1">
                {tips.map((tip, i) => (
                  <p key={i} className="text-primary/70 text-[10px] tracking-[0.15em] uppercase">
                    ⚡ {tip}
                  </p>
                ))}
              </div>
            )}

            {/* Tattoo selector */}
            <div>
              <p className="text-foreground/40 text-[10px] tracking-[0.3em] uppercase text-center mb-4">
                Select a design to overlay
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 justify-center" style={{ scrollbarWidth: "none" }}>
                {galleryImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedTattoo(img.src)}
                    className={`flex-none w-16 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                      selectedTattoo === img.src
                        ? "border-primary shadow-[0_0_15px_rgba(139,0,0,0.3)]"
                        : "border-border/20 hover:border-border/50"
                    }`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default TattooPreview;
