import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default {
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
