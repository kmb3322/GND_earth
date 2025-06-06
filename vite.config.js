import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@chakra-ui/react', '@chakra-ui/icons', '@emotion/react', '@emotion/styled', 'framer-motion'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // vercel dev 가 기본으로 3000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
