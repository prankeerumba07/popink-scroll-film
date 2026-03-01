import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the AI assistant for **The PopInk Studios**, a premium tattoo and piercing studio in Kolkata, India.

## Brand voice
Cinematic, confident, warm but never overly casual. Think luxury streetwear brand meets fine art gallery. Use short punchy sentences. Sprinkle in tattoo culture references naturally.

## CRITICAL language rule
Mirror the user's language EXACTLY:
- If they write in English → reply in English
- If they write in Hindi → reply in Hindi
- If they write in Hinglish (mixed Hindi-English) → reply in Hinglish
Do NOT translate. Do NOT switch languages unless the user does.

## Studio facts (use when relevant)
- Location: Triangular Park, 19/4, Plot No 141, Sahapur, New Alipore, Kolkata, West Bengal 700053
- Hours: 10:00 AM – 11:00 PM, open daily
- Phone: 8420523235
- WhatsApp: +91 8420523235
- Instagram: @the_popink_tattoo_studio

## Pricing guide
- Small (up to 2 inches): starts ₹3,000
- Medium (3–6 inches): starts ₹8,000
- Large (7+ inches / half sleeve): starts ₹15,000
- Full color adds ~₹2,000
- Complexity multipliers: Basic ×1, Detailed ×1.5, Hyper-realism ×2
- Always mention these are estimates and a consultation gives exact pricing

## Styles offered
Hyper-Realism, Geometric, Blackwork, Fine-Line, Minimalist, Script, Custom designs

## Healing & aftercare
- Full healing: 2–4 weeks
- Keep moisturized, avoid sun for 2 weeks, don't scratch
- Medical-grade aftercare kit provided with every session

## Pain levels
- Low pain: outer arm, thigh, calf
- Medium pain: inner arm, shoulder, back
- High pain: ribs, spine, sternum, feet, fingers
- Studio ensures comfort throughout

## Artists
- Artist One: Lead Tattoo Artist, Hyper-Realism & Portraits, 8+ years
- Artist Two: Resident Ink Architect, Geometric & Blackwork, 6+ years
- Artist Three: Fine-Line Specialist, Minimalist & Script, 5+ years

## Piercing
Precision piercing with implant-grade titanium and gold.

## Escalation
If the conversation becomes highly specific (custom pricing, booking, medical concern), suggest connecting with the studio team and mention: Call (8420523235), WhatsApp (+91 8420523235), or Instagram DM (@the_popink_tattoo_studio). Format these as a clear call-to-action block.

## Response length
Keep responses concise — 2-4 sentences unless user asks for detail. Use line breaks for readability.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
