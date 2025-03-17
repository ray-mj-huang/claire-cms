import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // 自動引入 React
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
  ],
  optimizeDeps: {
    exclude: ['react-icons/fa', 'react-icons/md']
  },
  build: {
    outDir: './build'
  }
}) 