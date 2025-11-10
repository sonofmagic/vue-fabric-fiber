import { defineConfig, mergeConfig } from 'vite'
import { createVitePlugins } from './vite.plugins'
import { sharedConfig } from './vite.shared.config'

export default mergeConfig(
  sharedConfig,
  defineConfig({
    plugins: createVitePlugins(),
    build: {
      outDir: 'dist-site',
      emptyOutDir: true,
    },
  }),
)
