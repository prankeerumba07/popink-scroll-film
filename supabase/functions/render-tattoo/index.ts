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
    const { bodyImage, tattooImage, placementHint } = await req.json();

    if (!bodyImage || typeof bodyImage !== "string") {
      return new Response(
        JSON.stringify({ error: "Body image is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!tattooImage || typeof tattooImage !== "string") {
      return new Response(
        JSON.stringify({ error: "Tattoo design is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const hint = placementHint && typeof placementHint === "string" && placementHint.trim().length > 0
      ? `Place the tattoo on the ${placementHint.trim()}.`
      : "Place the tattoo on the most prominent visible body part (arm, forearm, wrist, shoulder, neck, chest, back, leg, or hand) that suits its size and orientation.";

    const instruction = `You are a professional tattoo visualization artist. Take the SECOND image (a tattoo design on a white/transparent background) and render it photorealistically onto the body shown in the FIRST image, as if it were a real tattoo on the person's skin.

${hint}

Strict requirements:
- Follow the natural contours, curves, and anatomy of the body part — wrap the design around muscles and curves with subtle perspective warping.
- Match scale, orientation, and rotation to the body position naturally.
- Blend with the actual skin tone and texture seamlessly. Allow real skin grain and pores to show through the ink subtly.
- Apply realistic ink absorption: slightly soft edges, micro-bleed into skin, very faint fading typical of real tattoos. Not sharp like a sticker.
- Match the lighting direction, intensity, and color temperature of the original photo. Add soft skin highlights and subtle shadows where the body curves.
- Keep the rest of the photo (background, clothing, pose, face, hands, lighting) IDENTICAL to the original — only add the tattoo.
- The final result must look like a live front-camera / mirror preview of the person checking their real tattoo. Photorealistic, natural color balance, no oversaturation, no vector look, no flat overlay.
- Do not add any text, watermark, frame, or extra elements.

Return only the edited photo.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: instruction },
              { type: "image_url", image_url: { url: bodyImage } },
              { type: "image_url", image_url: { url: tattooImage } },
            ],
          },
        ],
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
