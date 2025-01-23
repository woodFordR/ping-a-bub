import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';


export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg?react",
    }),
  ],
  test: {
    include: ['./src/*.test.tsx', './src/**/test.tsx'],
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser'
    }
  },
  define: {
    global: ({})
  }
})

