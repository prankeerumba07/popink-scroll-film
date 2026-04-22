import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { compositeImage, bodyImage, tattooImage, placementHint } = await req.json();

    // Preferred mode: client sends a pre-composited image (body + tattoo already
    // placed by the user at the exact position/size/rotation). The AI only
    // refines realism — it MUST NOT move, resize, rotate, or remove anything.
    const hasComposite = typeof compositeImage === "string" && compositeImage.length > 0;
    const hasPair = typeof bodyImage === "string" && typeof tattooImage === "string";

    if (!hasComposite && !hasPair) {
      return new Response(
        JSON.stringify({ error: "compositeImage (preferred) or bodyImage+tattooImage required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const hintLine = placementHint && typeof placementHint === "string" && placementHint.trim().length > 0
      ? `User-noted body part: ${placementHint.trim()} (for context only — do NOT use this to reposition).`
      : "";

    const compositeInstruction = `You are a professional tattoo realism retoucher. The provided image already contains a body photo with a tattoo design overlaid at an EXACT position, size and rotation chosen by the user.

${hintLine}

YOUR ONLY JOB: make that overlaid tattoo look like real ink embedded BENEATH the skin surface — without moving, resizing, rotating, replacing, or removing it.

ABSOLUTE RULES (LOCKED — never violate):
- DO NOT change the tattoo's position. Keep its center pixel-locked to where it currently is.
- DO NOT change the tattoo's size or scale (not even by 1%).
- DO NOT change the tattoo's rotation or orientation (even if it looks upside down, mirrored, or angled).
- DO NOT redraw, restyle, simplify, straighten, or reinterpret the tattoo artwork. Preserve every line, dot, and detail of the design exactly.
- DO NOT remove, fade, blur, lighten, cover, or alter ANY existing tattoos already on the skin. Keep them 100% intact and visible.
- If the new tattoo overlaps an existing tattoo, blend the two naturally so both coexist on skin — never erase or hide the existing one.
- DO NOT change the background, clothing, pose, face, hands, framing, crop, or composition.
- DO NOT add new tattoos, text, watermarks, frames, borders, or any other elements.

WHAT TO IMPROVE (in place, only on the overlaid tattoo region) — embed the ink INTO the skin:
- Make the ink sit BENEATH the skin surface, not on top. No sticker, no decal, no double-layer effect.
- Slightly reduce ink opacity to mimic real ink absorption into the dermis (healed-tattoo look, not fresh paint).
- Soften edges subtly so there are no harsh sticker outlines; allow gentle ink diffusion into surrounding pores.
- Preserve and re-show natural skin texture, pores, micro-creases, and any body hair THROUGH the tattoo.
- Match skin tone, undertone, warmth, and ambient color cast so the ink reads as part of the skin.
- Apply micro-warping that follows skin curvature and muscle contours WITHOUT shifting the tattoo's position, size, or rotation.
- Match ambient lighting and shadows: add soft, physically correct highlights/shadows on the inked area consistent with the photo's existing light direction.
- Slight natural fading and micro-bleed for a healed look — avoid flat, vector, oversaturated, glowing, or over-sharpened ink.

The output must look like a natural mirror/front-camera photo of this exact body, with the same tattoo in the exact same place — just believably embedded in the skin. Return only the edited photo.`;

    const pairInstruction = `You are a professional tattoo visualization artist. Take the SECOND image (a tattoo design on a white/transparent background) and render it photorealistically onto the body shown in the FIRST image.

${hintLine || "Place the tattoo on the most prominent visible body part that suits its size and orientation."}

Strict requirements:
- Follow the natural contours, curves, and anatomy of the body part.
- Match scale, orientation, lighting and color temperature naturally.
- Do NOT remove, fade, or alter any existing tattoos already on the skin — keep them fully visible.
- Blend with skin tone and texture seamlessly; allow skin grain and pores to show through subtly.
- Apply realistic ink absorption: soft edges, micro-bleed, faint natural fading. No sticker / vector look.
- Keep background, clothing, pose, face, hands and lighting IDENTICAL to the original.
- No text, watermark, frame, or extra elements.

Return only the edited photo.`;

    const content: any[] = hasComposite
      ? [
          { type: "text", text: compositeInstruction },
          { type: "image_url", image_url: { url: compositeImage } },
        ]
      : [
          { type: "text", text: pairInstruction },
          { type: "image_url", image_url: { url: bodyImage } },
          { type: "image_url", image_url: { url: tattooImage } },
        ];

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content }],
        modalities: ["image", "text"],
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact the studio." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await resp.text();
      console.error("Gateway error:", resp.status, t);
      return new Response(
        JSON.stringify({ error: "Failed to render preview. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "No image returned. Try a clearer body photo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ image: imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("render-tattoo error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
