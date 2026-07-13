import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // The React Three Fiber landing-page hero scene is lazy-loaded via
    // dynamic import() and only fetched when that section actually
    // mounts, so its larger chunk size is expected and not on the
    // critical path for the rest of the app.
    chunkSizeWarningLimit: 1000,

  },
});