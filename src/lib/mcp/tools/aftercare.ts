import { defineTool } from "@lovable.dev/mcp-js";

const guide = {
  healingTime: "2–4 weeks for full healing",
  steps: [
    "Keep the area clean and moisturized with the provided medical-grade aftercare kit.",
    "Avoid direct sun exposure for at least 2 weeks.",
    "Do not scratch, pick, or peel scabs.",
    "Avoid swimming pools, saunas, and long soaks until fully healed.",
  ],
  painLevels: {
    low: ["outer arm", "thigh", "calf"],
    medium: ["inner arm", "shoulder", "back"],
    high: ["ribs", "spine", "sternum", "feet", "fingers"],
  },
};

export default defineTool({
  name: "get_aftercare_guide",
  title: "Get aftercare guide",
  description:
    "Get tattoo healing and aftercare guidance from The PopInk Studios, including expected pain levels by body placement.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(guide, null, 2) }],
    structuredContent: guide,
  }),
});
