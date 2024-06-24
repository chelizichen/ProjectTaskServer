import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { URL, fileURLToPath } from 'node:url'
import viteEslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), '')
  const BASE_URL = env.VITE_API_URL
  return {
    plugins: [react(), viteEslint()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base:'/web/',
    build:{
      outDir:"./web",
    },
    server:{
      proxy:{
        '/api':{
          target: BASE_URL,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, '')
        }
      }
    }
  }
})
