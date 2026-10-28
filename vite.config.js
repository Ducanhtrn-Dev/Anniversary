import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repository name from the GitHub setup screenshot: anniversary
export default defineConfig({
  plugins: [react()],
  base: '/anniversary/',
});
