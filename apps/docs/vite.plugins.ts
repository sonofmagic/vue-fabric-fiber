import type { PluginOption } from 'vite'
import path from 'node:path'
import Tailwindcss from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'

export function createVitePlugins(): PluginOption[] {
  return [
    VueRouter(
      {
        dts: path.relative(import.meta.dirname, './types/typed-router.d.ts'),
      },
    ),
    Vue(),
    Tailwindcss(),
  ]
}
