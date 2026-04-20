import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-gsap": ["gsap", "@gsap/react"],
          "vendor-three": [
            "three",
            "@react-three/fiber",
            "@react-three/drei",
            "@react-three/rapier",
            "@react-three/postprocessing",
          ],
        },
      },
    },
  },
});
