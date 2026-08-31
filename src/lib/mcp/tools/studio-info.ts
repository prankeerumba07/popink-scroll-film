import { defineTool } from "@lovable.dev/mcp-js";

const info = {
  name: "The PopInk Studios",
  tagline: "Where Skin Becomes Art.",
  city: "Kolkata, India",
  address:
    "Triangular Park, 19/4 Plot No. 141, Sahapur, New Alipore, Kolkata, West Bengal 700053",
  phone: "8420523235",
  whatsapp: "+91 8420523235",
  email: "hello@thepopinkstudios.com",
  hours: "10:00 AM – 11:00 PM, open daily",
  instagram: "@the_popink_tattoo_studio",
  website: "https://popink-scroll-film.lovable.app",
  services: [
    "Custom tattoos",
    "Cover-ups",
    "Precision piercing with implant-grade titanium and gold",
  ],
};

export default defineTool({
  name: "get_studio_info",
  title: "Get studio info",
  description:
    "Get The PopInk Studios contact details, address, opening hours, and services offered.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    structuredContent: info,
  }),
});
