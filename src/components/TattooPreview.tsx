import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCw, Maximize2, Minimize2, Download, Trash2, Replace, Check } from "lucide-react";
import { studioInfo } from "@/data/media";
import { useIsMobile } from "@/hooks/use-mobile";

interface Position { x: number; y: number; }

type Complexity = "minimal" | "detailed" | "hyperrealism";
type ColorType = "blackgrey" | "color";

const complexityMultiplier: Record<Complexity, number> = { minimal: 1, detailed: 1.5, hyperrealism: 2 };
const colorAddon: Record<ColorType, number> = { blackgrey: 0, color: 2000 };

const TattooPreview = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [tattooImage, setTattooImage] = useState<string | null>(null);
  const [tattooPos, setTattooPos] = useState<Position>({ x: 150, y: 150 });
  const [tattooSize, setTattooSize] = useState(120);
  const [tattooRotation, setTattooRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [showEstimate, setShowEstimate] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [complexity, setComplexity] = useState<Complexity>("minimal");
  const [colorType, setColorType] = useState<ColorType>("blackgrey");

  const bodyInputRef = useRef<HTMLInputElement>(null);
  const tattooInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  // Camera mode for mobile
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      setCameraStream(stream);
      setCameraMode(true);
    } catch (e) {
      console.error("Camera error:", e);
    }
  }, []);

  // Bind stream to video element when both are ready
  useEffect(() => {
    if (cameraMode && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraMode, cameraStream]);

  const stopCamera = useCallback(() => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setCameraMode(false);
  }, [cameraStream]);

  useEffect(() => () => { cameraStream?.getTracks().forEach((t) => t.stop()); }, [cameraStream]);

  // Touch/mouse handling — ONLY for tattoo dragging
  const getEventPos = (e: React.TouchEvent | React.MouseEvent): Position => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    if ("touches" in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent) => {
    if (!tattooImage) return;
    const pos = getEventPos(e);
    const dx = pos.x - tattooPos.x;
    const dy = pos.y - tattooPos.y;
    if (Math.sqrt(dx * dx + dy * dy) < tattooSize) {
      e.stopPropagation();
      e.preventDefault();
      setIsDragging(true);
      setDragOffset({ x: dx, y: dy });
    }
  };

  const handlePointerMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    e.preventDefault();
    const pos = getEventPos(e);
    setTattooPos({ x: pos.x - dragOffset.x, y: pos.y - dragOffset.y });
  };

  const handlePointerUp = (e: React.TouchEvent | React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsDragging(false);
  };

  // Export
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
      if (tattooImage) {
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
          ctx.globalCompositeOperation = "multiply";
          ctx.globalAlpha = 0.88;
          ctx.filter = "blur(0.4px) contrast(0.92) saturate(0.9)";
          ctx.drawImage(tattooImg, -sz / 2, -sz / 2, sz, sz);
          ctx.restore();
          const link = document.createElement("a");
          link.download = "popink-tattoo-preview.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        };
        tattooImg.src = tattooImage;
      }
    };
    bodyImg.src = bodyImage;
  }, [bodyImage, tattooImage, tattooPos, tattooSize, tattooRotation]);

  // Price estimate
  const estimatePrice = useCallback(() => {
    let min: number, max: number;
    if (tattooSize < 80) { min = 3000; max = 6000; }
    else if (tattooSize < 150) { min = 8000; max = 15000; }
    else if (tattooSize < 220) { min = 15000; max = 30000; }
    else { min = 25000; max = 50000; }

    const mult = complexityMultiplier[complexity];
    const addon = colorAddon[colorType];
    return {
      min: Math.round((min * mult + addon) / 100) * 100,
      max: Math.round((max * mult + addon) / 100) * 100,
    };
  }, [tattooSize, complexity, colorType]);

  const handleDone = () => setShowEstimate(true);

  const reset = () => {
    setBodyImage(null);
    setTattooImage(null);
    setShowEstimate(false);
    setTattooPos({ x: 150, y: 150 });
    setTattooSize(120);
    setTattooRotation(0);
    setComplexity("minimal");
    setColorType("blackgrey");
    stopCamera();
  };

  const estimate = estimatePrice();

  return (
    <section ref={sectionRef} className="relative py-16 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl md:text-6xl text-foreground tracking-[0.2em]">PREVIEW</h2>
        <div className="w-12 h-[1px] bg-primary mx-auto mt-4" />
        <p className="text-muted-foreground text-xs tracking-[0.2em] mt-4">VISUALIZE YOUR TATTOO</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        {/* Estimate overlay */}
        <AnimatePresence>
          {showEstimate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center border border-border/30 bg-card/80 backdrop-blur-sm rounded-sm p-8 md:p-12 mb-8"
            >
              <p className="text-foreground/40 text-xs tracking-[0.4em] mb-3 uppercase">Estimated Range</p>
              <p className="text-3xl md:text-4xl text-foreground tracking-[0.05em] mb-2">
                ₹{estimate.min.toLocaleString("en-IN")} – ₹{estimate.max.toLocaleString("en-IN")}
              </p>
              <p className="text-muted-foreground text-xs tracking-[0.1em] mb-6 max-w-md mx-auto">
                This is an approximate estimate based on size, complexity, and color.
                For accurate pricing, please consult our artists.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a
                  href={`https://wa.me/${studioInfo.whatsapp}?text=${encodeURIComponent("Hi PopInk Studios! I just used your tattoo preview tool and would like to discuss pricing.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors duration-300 rounded-sm"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:${studioInfo.phone}`}
                  className="inline-block border border-border/40 hover:border-primary/40 text-foreground/70 hover:text-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors duration-300 rounded-sm"
                >
                  Call Studio
                </a>
              </div>
              <button
                onClick={() => setShowEstimate(false)}
                className="mt-6 text-foreground/30 text-[10px] tracking-[0.2em] uppercase hover:text-foreground/60 transition-colors"
              >
                ← Back to Preview
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showEstimate && (
          <>
            {/* Upload area */}
            {!bodyImage && !cameraMode ? (
              <div className="border border-dashed border-border/40 rounded-sm p-10 text-center space-y-6">
                <div>
                  <p className="text-foreground/50 text-sm tracking-[0.15em] mb-4">
                    Upload a photo and your tattoo design
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <button
                      onClick={() => bodyInputRef.current?.click()}
                      className="flex items-center gap-2 px-6 py-3 border border-border/40 text-foreground/60 hover:text-foreground hover:border-primary/40 transition-colors text-xs tracking-[0.2em] uppercase rounded-sm"
                    >
                      <Upload size={16} /> {isMobile ? "Upload Photo" : "Upload Body Photo"}
                    </button>
                    <button
                      onClick={() => tattooInputRef.current?.click()}
                      className="flex items-center gap-2 px-6 py-3 border border-border/40 text-foreground/60 hover:text-foreground hover:border-primary/40 transition-colors text-xs tracking-[0.2em] uppercase rounded-sm"
                    >
                      <Upload size={16} /> Upload Design
                    </button>
                    {isMobile && (
                      <button
                        onClick={startCamera}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-primary-foreground transition-colors text-xs tracking-[0.2em] uppercase rounded-sm"
                      >
                        <Camera size={16} /> Camera Mode
                      </button>
                    )}
                  </div>
                </div>
                <input ref={bodyInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setBodyImage)} />
                <input ref={tattooInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setTattooImage)} />
              </div>
            ) : (
              <div className="space-y-5">
                {/* Preview canvas */}
                <div
                  ref={containerRef}
                  className="relative w-full aspect-[3/4] max-h-[70vh] bg-card/50 border border-border/20 rounded-sm overflow-hidden select-none"
                  style={{ touchAction: "none" }}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerUp}
                  onMouseLeave={handlePointerUp}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerUp}
                >
                  {cameraMode ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    bodyImage && <img src={bodyImage} alt="Body" className="w-full h-full object-contain pointer-events-none" draggable={false} />
                  )}

                  {tattooImage && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: tattooPos.x - tattooSize / 2,
                        top: tattooPos.y - tattooSize / 2,
                        width: tattooSize,
                        height: tattooSize,
                        transform: `rotate(${tattooRotation}deg) perspective(800px) rotateX(2deg) rotateY(1deg)`,
                        transformOrigin: "center center",
                      }}
                    >
                      <img
                        src={tattooImage}
                        alt="Tattoo overlay"
                        className="w-full h-full object-contain"
                        draggable={false}
                        style={{
                          mixBlendMode: "multiply",
                          opacity: 0.87,
                          filter: "blur(0.4px) contrast(0.9) saturate(0.85)",
                        }}
                      />
                      {/* Skin grain overlay for realism */}
                      <div
                        className="absolute inset-0 pointer-events-none rounded-sm"
                        style={{
                          mixBlendMode: "overlay",
                          opacity: 0.1,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "repeat",
                        }}
                      />
                      {/* Subtle shadow falloff at edges */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: "inset 0 0 15px 5px hsla(var(--background) / 0.15)",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  )}

                  {/* Drag hint */}
                  {tattooImage && !isDragging && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-sm">
                      <p className="text-[9px] text-foreground/50 tracking-[0.2em] uppercase">Drag tattoo to reposition</p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <Minimize2 size={14} className="text-foreground/40" />
                    <input type="range" min={40} max={300} value={tattooSize} onChange={(e) => setTattooSize(Number(e.target.value))} className="w-24 accent-[hsl(var(--primary))]" />
                    <Maximize2 size={14} className="text-foreground/40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCw size={14} className="text-foreground/40" />
                    <input type="range" min={0} max={360} value={tattooRotation} onChange={(e) => setTattooRotation(Number(e.target.value))} className="w-24 accent-[hsl(var(--primary))]" />
                  </div>
                </div>

                {/* Complexity & Color selectors */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground/40 text-[10px] tracking-[0.2em] uppercase">Complexity:</span>
                    {(["minimal", "detailed", "hyperrealism"] as Complexity[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => setComplexity(c)}
                        className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase rounded-sm border transition-colors ${
                          complexity === c
                            ? "border-primary text-primary bg-primary/10"
                            : "border-border/30 text-foreground/40 hover:text-foreground/60"
                        }`}
                      >
                        {c === "hyperrealism" ? "Hyper-Real" : c}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground/40 text-[10px] tracking-[0.2em] uppercase">Color:</span>
                    <button
                      onClick={() => setColorType("blackgrey")}
                      className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase rounded-sm border transition-colors ${
                        colorType === "blackgrey"
                          ? "border-primary text-primary bg-primary/10"
                          : "border-border/30 text-foreground/40 hover:text-foreground/60"
                      }`}
                    >
                      B&G
                    </button>
                    <button
                      onClick={() => setColorType("color")}
                      className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase rounded-sm border transition-colors ${
                        colorType === "color"
                          ? "border-primary text-primary bg-primary/10"
                          : "border-border/30 text-foreground/40 hover:text-foreground/60"
                      }`}
                    >
                      Color
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleDone}
                    disabled={!tattooImage}
                    className="flex items-center gap-1 px-5 py-2 bg-primary hover:bg-primary/80 text-primary-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors disabled:opacity-30"
                  >
                    <Check size={14} /> Done
                  </button>
                  <button
                    onClick={exportImage}
                    disabled={!tattooImage}
                    className="flex items-center gap-1 px-4 py-2 border border-border/30 text-foreground/50 hover:text-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors disabled:opacity-30"
                  >
                    <Download size={14} /> Save
                  </button>
                  <button
                    onClick={() => tattooInputRef.current?.click()}
                    className="flex items-center gap-1 px-4 py-2 border border-border/30 text-foreground/50 hover:text-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors"
                  >
                    <Replace size={14} /> Replace
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center gap-1 px-4 py-2 border border-border/30 text-foreground/50 hover:text-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors"
                  >
                    <Trash2 size={14} /> Reset
                  </button>
                </div>

                {/* Hidden file inputs */}
                <input ref={bodyInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setBodyImage)} />
                <input ref={tattooInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setTattooImage)} />
              </div>
            )}
          </>
        )}
      </motion.div>

      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default TattooPreview;
