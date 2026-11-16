import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Keep the heavy 3D runtime in its own lazily-loaded chunk. React and
        // zustand get their own chunk so the 3D chunk doesn't absorb them (which
        // would force it to load eagerly with the page).
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler|zustand|use-sync-external-store)\//.test(id)) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/three') || id.includes('@react-three') || id.includes('postprocessing')) {
            return 'three-vendor'
          }
        },
      },
    },
  },
})
