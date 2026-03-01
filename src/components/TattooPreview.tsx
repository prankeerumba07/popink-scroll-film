import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCw, Maximize2, Minimize2, Download, Trash2, Replace, Check } from "lucide-react";
import { galleryImages, studioInfo } from "@/data/media";
import { useIsMobile } from "@/hooks/use-mobile";

interface Position { x: number; y: number; }

const TattooPreview = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [tattooImage, setTattooImage] = useState<string | null>(null);
  const [selectedGalleryTattoo, setSelectedGalleryTattoo] = useState<string | null>(null);
  const [tattooPos, setTattooPos] = useState<Position>({ x: 150, y: 150 });
  const [tattooSize, setTattooSize] = useState(120);
  const [tattooRotation, setTattooRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [showEstimate, setShowEstimate] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const bodyInputRef = useRef<HTMLInputElement>(null);
  const tattooInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Active tattoo source (uploaded design takes priority, then gallery selection)
  const activeTattoo = tattooImage || selectedGalleryTattoo;

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
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.error("Camera error:", e);
    }
  }, []);

  const stopCamera = useCallback(() => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setCameraMode(false);
  }, [cameraStream]);

  useEffect(() => () => { cameraStream?.getTracks().forEach((t) => t.stop()); }, [cameraStream]);

  const getEventPos = (e: React.TouchEvent | React.MouseEvent): Position => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    if ("touches" in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
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
      if (activeTattoo) {
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
        tattooImg.src = activeTattoo;
      }
    };
    bodyImg.src = bodyImage;
  }, [bodyImage, activeTattoo, tattooPos, tattooSize, tattooRotation]);

  // Price estimate based on tattoo size ratio
  const estimatePrice = useCallback(() => {
    // Map size to price range
    if (tattooSize < 80) return { min: 2000, max: 4000 };
    if (tattooSize < 150) return { min: 7000, max: 10000 };
    if (tattooSize < 220) return { min: 12000, max: 18000 };
    return { min: 18000, max: 30000 };
  }, [tattooSize]);

  const handleDone = () => setShowEstimate(true);

  const reset = () => {
    setBodyImage(null);
    setTattooImage(null);
    setSelectedGalleryTattoo(null);
    setShowEstimate(false);
    setTattooPos({ x: 150, y: 150 });
    setTattooSize(120);
    setTattooRotation(0);
    stopCamera();
  };

  const tips: string[] = [];
  if (tattooSize < 60) tips.push("Very small — may lose detail over time");
  if (tattooSize > 200) tips.push("Large piece — consider multiple sessions");

  const estimate = estimatePrice();

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
                This is an approximate estimate based on size. For accurate pricing, please consult our artists.
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
              <div className="border border-dashed border-border/40 rounded-sm p-12 text-center space-y-8">
                {/* Step 1: Body image */}
                <div>
                  <p className="text-foreground/50 text-sm tracking-[0.15em] mb-4">
                    {isMobile ? "Upload a tattoo design, then use your camera" : "Step 1 — Upload a photo of the body area"}
                  </p>
                  <div className="flex gap-4 justify-center">
                    {!isMobile && (
                      <button
                        onClick={() => bodyInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-3 border border-border/40 text-foreground/60 hover:text-foreground hover:border-primary/40 transition-colors text-xs tracking-[0.2em] uppercase rounded-sm"
                      >
                        <Upload size={16} /> Upload Body Photo
                      </button>
                    )}
                    {isMobile && (
                      <>
                        <button
                          onClick={() => tattooInputRef.current?.click()}
                          className="flex items-center gap-2 px-6 py-3 border border-border/40 text-foreground/60 hover:text-foreground hover:border-primary/40 transition-colors text-xs tracking-[0.2em] uppercase rounded-sm"
                        >
                          <Upload size={16} /> Upload Design
                        </button>
                        <button
                          onClick={() => bodyInputRef.current?.click()}
                          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-primary-foreground transition-colors text-xs tracking-[0.2em] uppercase rounded-sm"
                        >
                          <Camera size={16} /> Upload Photo
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Desktop: tattoo upload */}
                {!isMobile && (
                  <div>
                    <p className="text-foreground/40 text-xs tracking-[0.15em] mb-4">
                      Step 2 — Upload your tattoo design (optional — you can also pick from gallery)
                    </p>
                    <button
                      onClick={() => tattooInputRef.current?.click()}
                      className="flex items-center gap-2 px-6 py-3 border border-border/40 text-foreground/60 hover:text-foreground hover:border-primary/40 transition-colors text-xs tracking-[0.2em] uppercase rounded-sm mx-auto"
                    >
                      <Upload size={16} /> Upload Design
                    </button>
                  </div>
                )}

                <input ref={bodyInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setBodyImage)} />
                <input ref={tattooInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setTattooImage)} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload(setBodyImage)} />
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
                  {cameraMode ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <img src={bodyImage!} alt="Body" className="w-full h-full object-contain" />
                  )}

                  {activeTattoo && (
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
                        src={activeTattoo}
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
                    <input type="range" min={40} max={300} value={tattooSize} onChange={(e) => setTattooSize(Number(e.target.value))} className="w-28 accent-[hsl(var(--primary))]" />
                    <Maximize2 size={14} className="text-foreground/40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCw size={14} className="text-foreground/40" />
                    <input type="range" min={0} max={360} value={tattooRotation} onChange={(e) => setTattooRotation(Number(e.target.value))} className="w-28 accent-[hsl(var(--primary))]" />
                  </div>
                  <button
                    onClick={handleDone}
                    disabled={!activeTattoo}
                    className="flex items-center gap-1 px-5 py-2 bg-primary hover:bg-primary/80 text-primary-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors disabled:opacity-30"
                  >
                    <Check size={14} /> Done
                  </button>
                  <button
                    onClick={exportImage}
                    disabled={!activeTattoo}
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

                {/* Hidden file inputs for replace */}
                <input ref={tattooInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setTattooImage)} />

                {/* Tips */}
                {tips.length > 0 && (
                  <div className="text-center space-y-1">
                    {tips.map((tip, i) => (
                      <p key={i} className="text-primary/70 text-[10px] tracking-[0.15em] uppercase">⚡ {tip}</p>
                    ))}
                  </div>
                )}

                {/* Tattoo selector from gallery */}
                <div>
                  <p className="text-foreground/40 text-[10px] tracking-[0.3em] uppercase text-center mb-4">
                    {tattooImage ? "Or pick from gallery" : "Select a design to overlay"}
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2 justify-center" style={{ scrollbarWidth: "none" }}>
                    {galleryImages.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => { setSelectedGalleryTattoo(img.src); setTattooImage(null); }}
                        className={`flex-none w-16 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                          activeTattoo === img.src
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
          </>
        )}
      </motion.div>

      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default TattooPreview;
