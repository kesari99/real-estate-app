import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':{
        // target:'http://localhost:5001',
        'target':'https://kesari-real-estate-app.onrender.com',
        secure: false
      }
    }
  },
  plugins: [react()],
})
