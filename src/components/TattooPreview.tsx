import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Camera, Upload, RotateCw, Maximize2, Minimize2, Download, Trash2, Check, MessageCircle, Phone, Sparkles, Loader2, Wand2 } from "lucide-react";
import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from "@supabase/supabase-js";
import { studioInfo } from "@/data/media";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Position { x: number; y: number; }
type Complexity = "minimal" | "detailed" | "hyperrealism";
type ColorType = "blackgrey" | "color";

interface ImageDimensions {
  width: number;
  height: number;
}

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
  const [tattooImageDimensions, setTattooImageDimensions] = useState<ImageDimensions | null>(null);
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
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [placementHint, setPlacementHint] = useState("");

  const bodyInputRef = useRef<HTMLInputElement>(null);
  const tattooInputRef = useRef<HTMLInputElement>(null);

  const getTattooDisplaySize = useCallback((size: number) => {
    const width = tattooImageDimensions?.width ?? 1;
    const height = tattooImageDimensions?.height ?? 1;
    if (width <= 0 || height <= 0) return { width: size, height: size };

    const aspectRatio = width / height;
    if (aspectRatio >= 1) {
      return { width: size, height: size / aspectRatio };
    }

    return { width: size * aspectRatio, height: size };
  }, [tattooImageDimensions]);

  const clearRenderedPreview = useCallback(() => {
    setRenderedImage(null);
  }, []);

  const getFunctionErrorDetails = async (error: unknown, fallbackMessage: string) => {
    if (error instanceof FunctionsHttpError) {
      const status = error.context.status;
      try {
        const payload = await error.context.json();
        const message = typeof payload?.error === "string" ? payload.error : fallbackMessage;
        return { status, message };
      } catch {
        return { status, message: fallbackMessage };
      }
    }

    if (error instanceof FunctionsRelayError || error instanceof FunctionsFetchError) {
      return {
        status: null,
        message: "Could not reach the rendering service. Please try again.",
      };
    }

    if (error instanceof Error) {
      return { status: null, message: error.message || fallbackMessage };
    }

    return { status: null, message: fallbackMessage };
  };

  // Auto-center tattoo (and set a sensible default size) whenever the body
  // photo OR the tattoo design changes. This means the moment a user uploads
  // or generates a tattoo, it appears centered on the body at a medium size —
  // ready to be dragged / resized / rotated. The size set here is the EXACT
  // size used by buildComposite for the final render (1:1, no post-scaling).
  useEffect(() => {
    if (!bodyImage || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTattooPos({ x: rect.width / 2, y: rect.height / 2 });
    if (tattooImage) {
      // Medium default = ~30% of the smaller container dimension, clamped.
      const medium = Math.round(Math.min(rect.width, rect.height) * 0.3);
      setTattooSize(Math.max(80, Math.min(240, medium)));
      setTattooRotation(0);
    }
  }, [bodyImage, tattooImage]);

  useEffect(() => {
    if (!tattooImage) {
      setTattooImageDimensions(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setTattooImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = tattooImage;
  }, [tattooImage]);

  // Invalidate realistic render whenever the visible tattoo changes
  useEffect(() => {
    clearRenderedPreview();
  }, [bodyImage, tattooImage, tattooPos, tattooSize, tattooRotation, clearRenderedPreview]);

  // NOTE: Realistic AI render is intentionally MANUAL (user clicks the button).
  // Auto-rendering caused size mismatches between the user-selected size and
  // the AI output. The local composite (drawn at exact tattooSize) is always
  // pixel-perfect to what the user picks; the AI pass is opt-in only.

  const handleFileUpload = useCallback((setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

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

  const generateTattoo = useCallback(async () => {
    const trimmed = aiPrompt.trim();
    if (trimmed.length < 3) { toast.error("Please describe your tattoo idea"); return; }
    if (trimmed.length > 500) { toast.error("Description too long (max 500 characters)"); return; }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-tattoo", {
        body: { prompt: trimmed, style: colorType },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.image) throw new Error("No image returned");
      setTattooImage(data.image);
      setShowAiPanel(false);
      toast.success("Design generated! Drag to position it.");
    } catch (e: unknown) {
      const { status, message } = await getFunctionErrorDetails(e, "Failed to generate design");
      console.error("Generate error:", { status, message, error: e });
      toast.error(status === 402 ? "AI design generation is temporarily unavailable. Please try again later." : message);
    } finally {
      setIsGenerating(false);
    }
  }, [aiPrompt, colorType]);

  const buildComposite = useCallback(async (): Promise<string | null> => {
    const container = containerRef.current;
    if (!container || !bodyImage || !tattooImage) return null;
    return new Promise((resolve) => {
      const bodyImg = new Image();
      bodyImg.crossOrigin = "anonymous";
      bodyImg.onload = () => {
        const tattooImg = new Image();
        tattooImg.crossOrigin = "anonymous";
        tattooImg.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = bodyImg.naturalWidth;
          canvas.height = bodyImg.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);
          ctx.drawImage(bodyImg, 0, 0);

          // Map on-screen container coords to source image coords (object-contain)
          const cw = container.clientWidth;
          const ch = container.clientHeight;
          const scale = Math.min(cw / bodyImg.naturalWidth, ch / bodyImg.naturalHeight);
          const dispW = bodyImg.naturalWidth * scale;
          const dispH = bodyImg.naturalHeight * scale;
          const offsetX = (cw - dispW) / 2;
          const offsetY = (ch - dispH) / 2;
          const cx = (tattooPos.x - offsetX) / scale;
          const cy = (tattooPos.y - offsetY) / scale;
          const previewSize = getTattooDisplaySize(tattooSize);
          const drawWidth = previewSize.width / scale;
          const drawHeight = previewSize.height / scale;

          // Pre-process tattoo on an offscreen canvas: remove white/near-white
          // background (chroma key to alpha) so only the ink renders. This
          // prevents the rectangular "sticker box" effect over the skin.
          const tCanvas = document.createElement("canvas");
          tCanvas.width = tattooImg.naturalWidth;
          tCanvas.height = tattooImg.naturalHeight;
          const tCtx = tCanvas.getContext("2d");
          if (!tCtx) return resolve(null);
          tCtx.drawImage(tattooImg, 0, 0);
          try {
            const imgData = tCtx.getImageData(0, 0, tCanvas.width, tCanvas.height);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
              const r = d[i], g = d[i + 1], b = d[i + 2];
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              if (lum > 235) {
                d[i + 3] = 0;
              } else if (lum > 180) {
                d[i + 3] = Math.round(d[i + 3] * ((235 - lum) / 55));
              }
            }
            tCtx.putImageData(imgData, 0, 0);
          } catch {
            // CORS-tainted; fall back to raw image
          }

          // Build a SKIN MASK from the body image so the tattoo can never
          // spill outside the skin region (no overflow onto background/clothes).
          // Heuristic skin detector in RGB + simple YCbCr range, then dilated
          // and blurred for soft edges. Mask is built at body-image resolution.
          const mCanvas = document.createElement("canvas");
          mCanvas.width = bodyImg.naturalWidth;
          mCanvas.height = bodyImg.naturalHeight;
          const mCtx = mCanvas.getContext("2d");
          let maskReady = false;
          if (mCtx) {
            try {
              mCtx.drawImage(bodyImg, 0, 0);
              const bodyData = mCtx.getImageData(0, 0, mCanvas.width, mCanvas.height);
              const bd = bodyData.data;
              const mask = mCtx.createImageData(mCanvas.width, mCanvas.height);
              const md = mask.data;
              for (let i = 0; i < bd.length; i += 4) {
                const r = bd[i], g = bd[i + 1], b = bd[i + 2];
                // RGB skin rule (Kovac et al., relaxed for varied tones)
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const rgbSkin =
                  r > 60 && g > 30 && b > 15 &&
                  max - min > 12 &&
                  Math.abs(r - g) > 10 &&
                  r > g && r > b;
                // YCbCr skin rule
                const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
                const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
                const ycbcrSkin = cb >= 77 && cb <= 135 && cr >= 133 && cr <= 178;
                const isSkin = rgbSkin || ycbcrSkin;
                md[i] = 255; md[i + 1] = 255; md[i + 2] = 255;
                md[i + 3] = isSkin ? 255 : 0;
              }
              mCtx.putImageData(mask, 0, 0);
              // Soft-blur the mask edges so the tattoo fades at skin boundaries
              // instead of cutting hard.
              const blurCanvas = document.createElement("canvas");
              blurCanvas.width = mCanvas.width;
              blurCanvas.height = mCanvas.height;
              const bCtx = blurCanvas.getContext("2d");
              if (bCtx) {
                bCtx.filter = `blur(${Math.max(2, Math.round(Math.min(mCanvas.width, mCanvas.height) * 0.005))}px)`;
                bCtx.drawImage(mCanvas, 0, 0);
                mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);
                mCtx.drawImage(blurCanvas, 0, 0);
              }
              maskReady = true;
            } catch {
              maskReady = false;
            }
          }

          // Render the tattoo onto an offscreen layer, then mask to skin,
          // then composite that masked layer onto the body with multiply.
          const layer = document.createElement("canvas");
          layer.width = canvas.width;
          layer.height = canvas.height;
          const lCtx = layer.getContext("2d");
          if (!lCtx) return resolve(null);
          lCtx.save();
          lCtx.translate(cx, cy);
          lCtx.rotate((tattooRotation * Math.PI) / 180);
          // Slightly higher opacity + boosted contrast/saturation so ink reads
          // darker and more vibrant once multiplied onto the skin, while still
          // keeping skin texture visible through it.
          lCtx.globalAlpha = 0.95;
          lCtx.filter = "blur(0.4px) contrast(1.08) saturate(1.18) brightness(0.92)";
          lCtx.drawImage(tCanvas, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          lCtx.restore();

          if (maskReady) {
            // Keep only pixels of the tattoo that fall inside the skin mask.
            lCtx.globalCompositeOperation = "destination-in";
            lCtx.globalAlpha = 1;
            lCtx.filter = "none";
            lCtx.drawImage(mCanvas, 0, 0);
          }

          ctx.save();
          ctx.globalCompositeOperation = "multiply";
          ctx.drawImage(layer, 0, 0);
          ctx.restore();

          resolve(canvas.toDataURL("image/jpeg", 0.92));
        };
        tattooImg.onerror = () => resolve(null);
        tattooImg.src = tattooImage;
      };
      bodyImg.onerror = () => resolve(null);
      bodyImg.src = bodyImage;
    });
  }, [bodyImage, tattooImage, tattooPos, tattooSize, tattooRotation, getTattooDisplaySize]);

  const renderRealistic = useCallback(async () => {
    if (!bodyImage || !tattooImage) {
      toast.error("Add a body photo and a tattoo design first");
      return;
    }
    setIsRendering(true);
    let compositeImage: string | null = null;
    try {
      compositeImage = await buildComposite();
      if (!compositeImage) throw new Error("Could not prepare preview");
      const { data, error } = await supabase.functions.invoke("render-tattoo", {
        body: { compositeImage, placementHint: placementHint.trim() || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.image) throw new Error("No image returned");
      setRenderedImage(data.image);

      if (data?.fallback) {
        toast.error(data.warning || "Realistic rendering is temporarily unavailable, so the exact manual preview is shown instead.");
        return;
      }

      toast.success("Realistic preview ready");
    } catch (e: unknown) {
      const { status, message } = await getFunctionErrorDetails(e, "Failed to render preview");
      console.error("Render error:", { status, message, error: e });

      if (status === 402 && compositeImage) {
        setRenderedImage(compositeImage);
        toast.error("Realistic rendering is temporarily unavailable, so the exact manual preview is shown instead.");
        return;
      }

      toast.error(message);
    } finally {
      setIsRendering(false);
    }
  }, [bodyImage, tattooImage, placementHint, buildComposite]);

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
    if (isDragging) { e.stopPropagation(); e.preventDefault(); }
    setIsDragging(false);
  };

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
          const scale = Math.min(container.clientWidth / bodyImg.width, container.clientHeight / bodyImg.height);
          const dispW = bodyImg.width * scale;
          const dispH = bodyImg.height * scale;
          const offsetX = (container.clientWidth - dispW) / 2;
          const offsetY = (container.clientHeight - dispH) / 2;
          const cx = (tattooPos.x - offsetX) / scale;
          const cy = (tattooPos.y - offsetY) / scale;
          const previewSize = getTattooDisplaySize(tattooSize);
          const drawWidth = previewSize.width / scale;
          const drawHeight = previewSize.height / scale;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((tattooRotation * Math.PI) / 180);
          ctx.globalCompositeOperation = "multiply";
          ctx.globalAlpha = 0.88;
          ctx.filter = "blur(0.4px) contrast(0.92) saturate(0.9)";
          ctx.drawImage(tattooImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
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
  }, [bodyImage, tattooImage, tattooPos, tattooSize, tattooRotation, getTattooDisplaySize]);

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

  const estimate = estimatePrice();

  const whatsappMessage = encodeURIComponent(
    `Hi PopInk Studios, I just tried your tattoo preview tool and got an estimate of ₹${estimate.min.toLocaleString("en-IN")}–₹${estimate.max.toLocaleString("en-IN")}. I'd like to consult for this design.`
  );

  const reset = () => {
    setBodyImage(null);
    setTattooImage(null);
    setShowEstimate(false);
    setTattooPos({ x: 150, y: 150 });
    setTattooSize(120);
    setTattooRotation(0);
    setComplexity("minimal");
    setColorType("blackgrey");
    setAiPrompt("");
    setShowAiPanel(false);
    setRenderedImage(null);
    setPlacementHint("");
    stopCamera();
  };

  const hasPreview = bodyImage || cameraMode;

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
        {/* ── Conversion CTA after DONE ── */}
        <AnimatePresence>
          {showEstimate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center border border-border/30 bg-card/80 backdrop-blur-sm rounded-sm p-8 md:p-12 mb-8"
            >
              <p className="text-foreground/60 text-sm tracking-[0.3em] uppercase mb-2">Like What You See?</p>
              <p className="text-foreground/40 text-xs tracking-[0.15em] mb-6">
                Your design is ready for consultation.
              </p>

              <p className="text-foreground/40 text-[10px] tracking-[0.4em] mb-2 uppercase">Estimated Range</p>
              <p className="text-3xl md:text-4xl text-foreground tracking-[0.05em] mb-2">
                ₹{estimate.min.toLocaleString("en-IN")} – ₹{estimate.max.toLocaleString("en-IN")}
              </p>
              <p className="text-muted-foreground text-[10px] tracking-[0.1em] mb-8 max-w-sm mx-auto">
                Approximate estimate based on size, complexity & color. Consult our artists for accurate pricing.
              </p>

              <div className="flex gap-3 justify-center flex-wrap">
                <a
                  href={`https://wa.me/${studioInfo.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors duration-300 rounded-sm"
                >
                  <MessageCircle size={16} /> Consult via WhatsApp
                </a>
                <a
                  href={`tel:${studioInfo.phone}`}
                  className="inline-flex items-center gap-2 border border-border/40 hover:border-primary/40 text-foreground/70 hover:text-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors duration-300 rounded-sm"
                >
                  <Phone size={16} /> Call Now
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
            {/* ── Initial upload area ── */}
            {!hasPreview ? (
              <div className="border border-dashed border-border/40 rounded-sm p-10 text-center space-y-6">
                <p className="text-foreground/50 text-sm tracking-[0.15em] mb-4">
                  Start by uploading a body photo
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={() => bodyInputRef.current?.click()}
                    className="flex items-center gap-2 px-6 py-3 border border-primary/50 text-foreground/70 hover:text-foreground hover:border-primary transition-colors text-xs tracking-[0.2em] uppercase rounded-sm"
                  >
                    <Upload size={16} /> {isMobile ? "Upload Photo" : "Upload Body Photo"}
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

                  {/* Tattoo CSS overlay (hidden while realistic render is shown) */}
                  {tattooImage && !renderedImage && (
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
                          opacity: 0.95,
                          filter: "blur(0.3px) contrast(1.1) saturate(1.2) brightness(0.9)",
                        }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none rounded-sm"
                        style={{
                          mixBlendMode: "overlay",
                          opacity: 0.12,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "repeat",
                        }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: "inset 0 0 18px 6px hsla(var(--background) / 0.18)",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  )}

                  {/* Realistic AI-rendered preview (replaces CSS overlay) */}
                  {renderedImage && (
                    <img
                      src={renderedImage}
                      alt="Realistic tattoo preview"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  )}

                  {/* Rendering loader */}
                  {isRendering && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm">
                      <Loader2 size={28} className="text-primary animate-spin" />
                      <p className="text-foreground/80 text-[10px] tracking-[0.3em] uppercase">Rendering on skin…</p>
                      <p className="text-foreground/40 text-[9px] tracking-[0.15em]">This can take 10–20 seconds</p>
                    </div>
                  )}

                  {/* Prompt to upload OR generate tattoo design */}
                  {!tattooImage && !showAiPanel && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/30 backdrop-blur-[2px]">
                      <button
                        onClick={() => setShowAiPanel(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-primary-foreground transition-colors text-xs tracking-[0.2em] uppercase rounded-sm shadow-lg"
                      >
                        <Sparkles size={16} /> Generate with AI
                      </button>
                      <button
                        onClick={() => tattooInputRef.current?.click()}
                        className="flex items-center gap-2 px-5 py-2.5 border border-border/50 bg-background/70 hover:border-primary/60 text-foreground/80 hover:text-foreground transition-colors text-[10px] tracking-[0.2em] uppercase rounded-sm"
                      >
                        <Upload size={14} /> Upload Your Design
                      </button>
                    </div>
                  )}

                  {/* AI generation panel */}
                  {!tattooImage && showAiPanel && (
                    <div className="absolute inset-0 flex items-center justify-center p-4 bg-background/85 backdrop-blur-sm">
                      <div className="w-full max-w-sm space-y-3">
                        <div className="text-center">
                          <Wand2 size={20} className="text-primary mx-auto mb-2" />
                          <p className="text-foreground/80 text-xs tracking-[0.25em] uppercase">Describe Your Tattoo</p>
                          <p className="text-foreground/40 text-[10px] tracking-[0.1em] mt-1">AI will generate a design for you</p>
                        </div>
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g. A minimalist wolf howling at a crescent moon, fine line"
                          maxLength={500}
                          rows={3}
                          disabled={isGenerating}
                          className="w-full bg-card/80 border border-border/40 rounded-sm px-3 py-2 text-xs text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 resize-none"
                        />
                        <div className="flex items-center justify-between text-[9px] text-foreground/40 tracking-[0.15em] uppercase">
                          <span>Style: {colorType === "color" ? "Color" : "B&G"}</span>
                          <span>{aiPrompt.length}/500</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={generateTattoo}
                            disabled={isGenerating || aiPrompt.trim().length < 3}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-xs tracking-[0.2em] uppercase rounded-sm transition-colors"
                          >
                            {isGenerating ? (<><Loader2 size={14} className="animate-spin" /> Generating…</>) : (<><Sparkles size={14} /> Generate</>)}
                          </button>
                          <button
                            onClick={() => setShowAiPanel(false)}
                            disabled={isGenerating}
                            className="px-4 py-2.5 border border-border/40 text-foreground/50 hover:text-foreground text-xs tracking-[0.2em] uppercase rounded-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Drag hint */}
                  {tattooImage && !isDragging && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-sm">
                      <p className="text-[9px] text-foreground/50 tracking-[0.2em] uppercase">Drag tattoo to reposition</p>
                    </div>
                  )}
                </div>

                {/* Controls — only show when tattoo is placed */}
                {tattooImage && (
                  <>
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

                    {/* Complexity & Color */}
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
                            colorType === "blackgrey" ? "border-primary text-primary bg-primary/10" : "border-border/30 text-foreground/40 hover:text-foreground/60"
                          }`}
                        >B&G</button>
                        <button
                          onClick={() => setColorType("color")}
                          className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase rounded-sm border transition-colors ${
                            colorType === "color" ? "border-primary text-primary bg-primary/10" : "border-border/30 text-foreground/40 hover:text-foreground/60"
                          }`}
                        >Color</button>
                      </div>
                    </div>

                    {/* Realistic AI render row */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <input
                        type="text"
                        value={placementHint}
                        onChange={(e) => setPlacementHint(e.target.value)}
                        placeholder="Placement (optional): e.g. forearm, wrist, neck"
                        maxLength={60}
                        className="bg-card/60 border border-border/40 rounded-sm px-3 py-2 text-[11px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 w-64"
                      />
                      {!renderedImage ? (
                        <button
                          onClick={renderRealistic}
                          disabled={isRendering}
                          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/80 disabled:opacity-50 text-primary-foreground text-[11px] tracking-[0.2em] uppercase rounded-sm transition-colors"
                        >
                          {isRendering ? <><Loader2 size={14} className="animate-spin" /> Rendering…</> : <><Wand2 size={14} /> Render Realistic</>}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={renderRealistic}
                            disabled={isRendering}
                            className="flex items-center gap-1.5 px-4 py-2 border border-primary/50 text-primary hover:bg-primary/10 text-[11px] tracking-[0.2em] uppercase rounded-sm transition-colors"
                          >
                            <RotateCw size={14} /> Re-render
                          </button>
                          <button
                            onClick={() => setRenderedImage(null)}
                            className="flex items-center gap-1.5 px-4 py-2 border border-border/40 text-foreground/60 hover:text-foreground text-[11px] tracking-[0.2em] uppercase rounded-sm transition-colors"
                          >
                            Edit Manually
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {tattooImage && (
                    <>
                      <button
                        onClick={() => setShowEstimate(true)}
                        className="flex items-center gap-1 px-5 py-2 bg-primary hover:bg-primary/80 text-primary-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors"
                      >
                        <Check size={14} /> Done
                      </button>
                      <button
                        onClick={exportImage}
                        className="flex items-center gap-1 px-4 py-2 border border-border/30 text-foreground/50 hover:text-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors"
                      >
                        <Download size={14} /> Save
                      </button>
                      <button
                        onClick={() => { setTattooImage(null); setShowAiPanel(true); }}
                        className="flex items-center gap-1 px-4 py-2 border border-primary/40 text-primary/80 hover:text-primary hover:border-primary text-xs tracking-[0.15em] uppercase rounded-sm transition-colors"
                      >
                        <Sparkles size={14} /> AI Regenerate
                      </button>
                      <button
                        onClick={() => tattooInputRef.current?.click()}
                        className="flex items-center gap-1 px-4 py-2 border border-border/30 text-foreground/50 hover:text-foreground text-xs tracking-[0.15em] uppercase rounded-sm transition-colors"
                      >
                        <Upload size={14} /> Replace Design
                      </button>
                    </>
                  )}
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
