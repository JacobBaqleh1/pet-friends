// @ts-check
import { defineConfig } from "astro/config";

// Static site → `npm run build` writes to `dist/`.
// Cloudflare Pages adapter can be added later if needed for template hosting.
export default defineConfig({
  output: "static",
});
