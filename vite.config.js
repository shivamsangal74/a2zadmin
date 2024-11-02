import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { apiUrl } from "./src/Utills/constantt";

export default defineConfig({
  server: {
    proxy: {
      "/upload": {
        target: apiUrl,
        changeOrigin: true,
        rewrite: (path) => {
          console.log("Rewriting path:", path);
          return path;
        },
      },
    },
  },
  plugins: [react()],
});
