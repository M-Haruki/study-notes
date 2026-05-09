import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/study-notes/api": {
        target: "http://localhost:1323", // Goサーバーのアドレス
        changeOrigin: true,
      },
    },
  },
  base: "/study-notes/",
});
