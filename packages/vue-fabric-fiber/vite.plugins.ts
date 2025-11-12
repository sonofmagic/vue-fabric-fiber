import type { PluginOption } from 'vite'
import { promises as fs } from 'node:fs'
import Tailwindcss from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import path from 'pathe'
import VueRouter from 'unplugin-vue-router/vite'

export function createVitePlugins(): PluginOption[] {
  const shimPatchPlugin: PluginOption = {
    name: 'patch-vue-repl-es-module-shims',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('@vue/repl') || !code.includes('es-module-shims.wasm.js')) {
        return null
      }

      return {
        code: code.replace(/es-module-shims\.wasm\.js/g, 'es-module-shims.js'),
        map: null,
      }
    },
  }

  const replLibraryAssetPlugin: PluginOption = {
    name: 'copy-vue-fabric-fiber-repl-lib',
    apply: 'build',
    async generateBundle() {
      const distEntry = path.resolve(import.meta.dirname, './dist/index.js')
      let source: string
      try {
        source = await fs.readFile(distEntry, 'utf8')
      }
      catch (error) {
        this.warn(`Unable to read library bundle for docs demos at ${distEntry}: ${error}`)
        return
      }

      this.emitFile({
        type: 'asset',
        fileName: 'repl/vue-fabric-fiber/index.js',
        source,
      })
    },
  }

  return [
    VueRouter(
      {
        dts: path.relative(import.meta.dirname, './types/typed-router.d.ts'),
      },
    ),
    Vue(),
    Tailwindcss(),
    shimPatchPlugin,
    replLibraryAssetPlugin,
  ]
}
