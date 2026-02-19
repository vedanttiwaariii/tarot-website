import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    https: fs.existsSync('./key.pem') ? {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem')
    } : false,
    proxy: {
      '/api': {
        target: process.env.USE_HTTPS === 'true' ? 'https://localhost:5000' : 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
