import path from 'node:path'
import { defineConfig } from 'vite'
import { createVitePlugins } from './vite.plugins'

const workspaceRoot = path.resolve(import.meta.dirname, '..', '..')
const libraryRoot = path.resolve(workspaceRoot, 'packages/vue-fabric-fiber')

export default defineConfig({
  plugins: createVitePlugins(),
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: true,
    fs: {
      allow: [workspaceRoot, libraryRoot],
    },
  },
  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
})
