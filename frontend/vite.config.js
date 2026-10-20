import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Development: `npm run dev` serves the React app on :5173 and forwards /api to the Java backend on :8080.
// Production: `npm run build` writes the app straight into the Spring Boot project (src/main/resources/static),
// so the single Java jar serves both the API and the website.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:8080' }
  },
  build: {
    outDir: '../backend/src/main/resources/static',
    emptyOutDir: true
  }
});
