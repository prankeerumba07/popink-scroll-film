import { defineMcp } from "@lovable.dev/mcp-js";
import studioInfoTool from "./tools/studio-info";
import listStylesTool from "./tools/list-styles";
import estimatePriceTool from "./tools/estimate-price";
import aftercareTool from "./tools/aftercare";

export default defineMcp({
  name: "ink-film",
  title: "Ink Film",
  version: "0.1.0",
  instructions:
    "Tools for The PopInk Studios, a tattoo and piercing studio in Kolkata. Use `get_studio_info` for contact details, address, and hours; `list_styles_and_artists` for the styles offered and resident artists; `estimate_tattoo_price` for INR price estimates by size and complexity; `get_aftercare_guide` for healing and pain-level guidance.",
  tools: [studioInfoTool, listStylesTool, estimatePriceTool, aftercareTool],
});
