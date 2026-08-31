import { defineTool } from "@lovable.dev/mcp-js";

const styles = [
  { name: "Hyper-Realism", description: "Photorealistic portraits and detailed shading." },
  { name: "Geometric", description: "Precise linework, symmetry, and sacred geometry." },
  { name: "Blackwork", description: "Bold solid black fills and heavy contrast." },
  { name: "Fine-Line", description: "Delicate, thin single-needle linework." },
  { name: "Minimalist", description: "Small, clean, understated designs." },
  { name: "Script", description: "Lettering, quotes, and calligraphy." },
  { name: "Custom", description: "Fully bespoke designs developed with an artist." },
];

const artists = [
  { name: "Artist One", role: "Lead Tattoo Artist", specialty: "Hyper-Realism & Portraits", experience: "8+ years" },
  { name: "Artist Two", role: "Resident Ink Architect", specialty: "Geometric & Blackwork", experience: "6+ years" },
  { name: "Artist Three", role: "Fine-Line Specialist", specialty: "Minimalist & Script", experience: "5+ years" },
];

export default defineTool({
  name: "list_styles_and_artists",
  title: "List tattoo styles and artists",
  description:
    "List the tattoo styles offered by The PopInk Studios and the resident artists with their specialties.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify({ styles, artists }, null, 2) }],
    structuredContent: { styles, artists },
  }),
});
