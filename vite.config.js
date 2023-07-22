import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ffxiv-overlay-dungeon-cn/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }

  if(mode === 'offline'){
    config.base = './'
    config.plugins.push(legacy({
      targets: ['defaults', 'not IE 11'],
    }))
  }

  return config
})
