import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Supports Vercel root ("/") by default, or custom base path if specified (e.g. GitHub Pages)
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    host: true,
    port: 5173,
  },
});
