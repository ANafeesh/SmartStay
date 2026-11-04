import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Automatically support GitHub Pages repo path or custom base
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === "production" ? "/SmartStay/" : "/"),
  server: {
    host: true,
    port: 5173,
  },
});
