import type { UserConfig } from 'vite'
import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { mergeConfig } from 'vite'
import DTS from 'vite-plugin-dts'
import { sharedConfig } from './vite.shared.config'

export default mergeConfig(sharedConfig, {
  plugins: [
    Vue(),
    DTS(
      {
        tsconfigPath: './tsconfig.app.json',
        entryRoot: './lib',
      },
    ),
  ],
  // https://vite.dev/guide/build.html#library-mode
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'lib/index'),
      name: 'icebreaker',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'fabric', 'p-queue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'vue': 'Vue',
          'fabric': 'fabric',
          'p-queue': 'PQueue',
        },
      },
    },
  },
} satisfies UserConfig)
