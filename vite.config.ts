import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { URL, fileURLToPath } from 'node:url'
import viteEslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  loadEnv(mode, process.cwd(), '')
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
    }
  }

})
