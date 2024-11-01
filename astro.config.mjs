// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: "https://nancy-is.vercel.app",
  output: "server",
  prefetch: true,
  integrations: [react()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
