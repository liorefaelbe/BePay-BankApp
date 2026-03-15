import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
<<<<<<< HEAD
        target: "http://localhost:4000",
=======
        target: "http://10.100.102.17:4000",
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
