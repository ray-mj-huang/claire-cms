import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
    outDir: 'build'
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
}) 