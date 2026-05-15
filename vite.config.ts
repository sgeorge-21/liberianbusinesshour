import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Configure for Vercel deployment
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    ssr: {
      external: [],
      noExternal: [],
    },
  },
});
