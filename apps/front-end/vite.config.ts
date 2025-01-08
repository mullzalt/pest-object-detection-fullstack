import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      strict: true,
    },

    proxy: {
      "/v1/object-detection/yolov5": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/static": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
