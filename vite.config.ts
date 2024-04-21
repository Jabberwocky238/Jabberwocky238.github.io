import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 将 @ 指向 src 目录
      'P': resolve(__dirname, 'public') // 将 P 指向 src/pages 目录
    }
  }
})
