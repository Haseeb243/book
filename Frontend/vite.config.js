import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // Forward API calls from the frontend dev server to backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Proxy image files and other static assets (except those in src/ or node_modules)
      '^/(?!src/|node_modules/|@vite/|@fs/|@id/).*\\.(jpg|jpeg|png|gif|svg|webp|json|pdf)$': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
