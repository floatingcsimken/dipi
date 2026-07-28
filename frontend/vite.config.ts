import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Szükséges ahhoz, hogy Dockerből elérhető legyen
    port: 5173
  }
});