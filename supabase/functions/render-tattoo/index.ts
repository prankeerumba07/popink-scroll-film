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

    const compositeInstruction = `You are a professional tattoo realism retoucher. The provided image already contains a body photo with a tattoo design overlaid at an EXACT position, size and rotation chosen by the user (it has been pre-blended with multiply so only the dark ink shows — there is NO rectangular background, only the tattoo lines).

${hintLine}

YOUR ONLY JOB: make that overlaid tattoo look like real ink embedded BENEATH the skin surface — without moving, resizing, rotating, replacing, or removing it.

ABSOLUTE RULES (LOCKED — never violate):
- DO NOT change the tattoo's position. Keep its center pixel-locked to where it currently is.
- DO NOT change the tattoo's size, scale, width, or height (not even by 1%). The bounding box of the tattoo in the output MUST match the bounding box in the input pixel-for-pixel.
- DO NOT resize, upscale, downscale, zoom, crop, re-frame, or re-fit the tattoo for any reason (lighting, contour, realism, or composition).
- DO NOT change the output image's resolution, aspect ratio, or canvas size. Return the image at the SAME width × height as the input.
- DO NOT change the tattoo's rotation or orientation (even if it looks upside down, mirrored, or angled).
- DO NOT redraw, restyle, simplify, straighten, or reinterpret the tattoo artwork. Preserve every line, dot, and detail of the design exactly.
- DO NOT remove, fade, blur, lighten, cover, or alter ANY existing tattoos already on the skin. Keep them 100% intact and visible at full original opacity.
- DO NOT paint a solid rectangular patch, box, photo crop, or background of any kind around the tattoo. The tattoo must read as ink only — never as a pasted photo or sticker.
- DO NOT change the background, clothing, pose, face, hands, framing, crop, or composition.
- DO NOT add new tattoos, text, watermarks, frames, borders, or any other elements.

BOUNDARY CONSTRAINT (CRITICAL — fixes spill outside skin):
- The tattoo MUST be strictly contained within the visible skin region of the body part it sits on.
- ANY ink stroke that currently extends past the skin edge onto background, clothing, hair, jewellery, or empty space MUST be erased / cut off cleanly at the skin silhouette.
- Treat the skin silhouette as a hard mask: ink lives only INSIDE the body. Outside the body = no ink, no halo, no shadow, no fringe.
- At the skin edge, fade the ink softly into the boundary (1–2 px feather) so the cutoff looks natural, never a hard rectangle.
- Do NOT push the tattoo back inward to "fit" — keep its position, just clip whatever falls outside.

ADVANCED COMPOSITING (this is the key fix):
- Treat the new tattoo strictly as sub-dermal INK, not as a top layer. The skin is the base; the ink lives just under it.
- Use multiply / soft-light blending behavior: ink only DARKENS the underlying skin, it never lightens or covers it.
- Remove any residual rectangular boundary, halo, colored fringe, or background tint around the tattoo so only the actual ink strokes remain visible.
- Modulate ink opacity dynamically based on local skin brightness and texture — slightly lighter on bright highlights, slightly denser in shadow valleys.
- Soften edges with anti-aliased micro ink-bleed into surrounding pores. No hard sticker outlines, no rectangular borders, no visible image seam.
- Skin texture, pores, fine hair, freckles, veins and lighting MUST remain visible THROUGH the tattoo. If you cannot see skin texture through the ink, the result is wrong.

OVERLAP WITH EXISTING TATTOOS (key fix):
- If the new tattoo overlaps an existing tattoo, DO NOT stack them as opaque layers and DO NOT create muddy double-dark patches.
- Blend both designs using shared transparency and shared skin texture so both remain clearly visible.
- The existing tattoo's lines must still be readable through the new one; balance opacity to avoid a solid black mass.

SKIN INTEGRATION:
- Match skin tone, undertone, warmth, and ambient color cast so the ink reads as part of this body.
- Apply a slight natural fade to simulate healed ink (not fresh wet paint), but DO NOT wash the tattoo out.
- Add subtle ink diffusion / micro-bleed into adjacent pores at the edges.

INK INTENSITY (IMPORTANT — keep tattoo dark and vibrant):
- The tattoo must read as DARK, DEFINED, and clearly visible — never faded, washed out, ghosted, or barely-there.
- For black/grey designs: preserve deep, rich blacks and crisp mid-tones. Enhance contrast slightly so lines stay sharp and readable, without going pure flat black.
- For colored designs: preserve full color richness and saturation. Colors should look freshly healed — vivid but believable, embedded under skin (NOT neon, NOT glowing, NOT painted on top).
- Modulate intensity only slightly with skin tone/lighting — never drop overall ink density below ~85% of the input.

CONTOUR & LIGHTING:
- Apply micro-warping that follows skin curvature and muscle/arm shape WITHOUT shifting the tattoo's position, size, or rotation.
- Match the photo's existing light direction: add soft, physically correct highlights and shadows on the inked area.
- Avoid flat, vector, glowing, oversaturated, or over-sharpened ink.

The output must look like a natural mirror/front-camera photo of this exact body, with the same tattoo in the exact same place — just believably embedded under the skin, with no rectangular box, no sticker edge, and every existing tattoo fully preserved. Return only the edited photo.`;

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
