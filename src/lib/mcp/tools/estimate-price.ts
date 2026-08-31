import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

const BASE: Record<string, number> = {
  small: 3000,
  medium: 8000,
  large: 15000,
};

const COMPLEXITY: Record<string, number> = {
  basic: 1,
  detailed: 1.5,
  "hyper-realism": 2,
};

const COLOR_ADD = 2000;

export default defineTool({
  name: "estimate_tattoo_price",
  title: "Estimate tattoo price",
  description:
    "Estimate the price range in INR for a tattoo at The PopInk Studios based on size, complexity, and whether it is full color.",
  inputSchema: {
    size: z.enum(["small", "medium", "large"]).describe(
      "small = up to 2 inches, medium = 3-6 inches, large = 7+ inches or half sleeve",
    ),
    complexity: z.enum(["basic", "detailed", "hyper-realism"]).describe("Design complexity."),
    color: z.boolean().optional().describe("True for full color, false or omitted for black and grey."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ size, complexity, color }) => {
    const base = BASE[size];
    const multiplier = COMPLEXITY[complexity];
    if (!base || !multiplier) throw new ToolError("Unknown size or complexity.");

    const low = Math.round(base * multiplier + (color ? COLOR_ADD : 0));
    const high = Math.round(low * 1.4);

    const result = {
      currency: "INR",
      estimateLow: low,
      estimateHigh: high,
      size,
      complexity,
      color: Boolean(color),
      note:
        "This is an estimate only. Exact pricing is confirmed after a consultation. Call 8420523235 or WhatsApp +91 8420523235.",
    };

    return {
      content: [
        {
          type: "text",
          text: `Estimated ₹${low.toLocaleString("en-IN")} – ₹${high.toLocaleString("en-IN")} for a ${complexity} ${size} ${color ? "full colour" : "black & grey"} tattoo. ${result.note}`,
        },
      ],
      structuredContent: result,
    };
  },
});
