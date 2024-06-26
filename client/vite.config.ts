import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ws/': {
        target: 'http://localhost:3000/socket.io/',
        ws: true,
        rewrite: (path) => path.replace(/^\/ws/, ''),
      },
    }
  }
})
