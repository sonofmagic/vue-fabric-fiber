<script setup lang="ts">
import type { FabricTextModelValue } from '~/index'
import { computed, ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText } from '~/index'

const copy = ref<FabricTextModelValue>({
  text: 'Design once, render everywhere.',
  left: 360,
  top: 220,
  width: 560,
  fontSize: 48,
  fontFamily: 'DM Sans',
  fontWeight: '600',
  fill: '#fde047',
  textAlign: 'center',
  lineHeight: 1.2,
  angle: -4,
  shadow: null,
  padding: 12,
})

const author = ref<FabricTextModelValue>({
  text: '— Fabric Ports',
  left: 360,
  top: 340,
  fontSize: 28,
  fontFamily: 'DM Sans',
  fill: '#f8fafc',
  textAlign: 'center',
  width: 320,
  selectable: false,
})

const alignments = ['left', 'center', 'right'] as const
const gradient = computed(() => {
  return `linear-gradient(135deg, ${copy.value.fill ?? '#fde047'}20 0%, #0f172a 100%)`
})

const backgroundUrl = ref('https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80')
const showGrid = ref(true)
</script>

<template>
  <div class="mx-auto grid max-w-6xl gap-8 py-6 lg:grid-cols-[1fr_320px]">
    <div class="rounded-3xl border border-slate-900 bg-slate-950/70 p-6 shadow-xl">
      <FabricCanvas :canvas-options="{ width: 720, height: 480, preserveObjectStacking: true }">
        <FabricImage :src="backgroundUrl" width="720" height="480" :has-controls="false" :selectable="false" />
        <FabricImage
          v-if="showGrid"
          src="https://i.imgur.com/kze6PzT.png"
          width="720"
          height="480"
          :left="0"
          :top="0"
          :selectable="false"
          :has-controls="false"
        />
        <FabricText v-model="copy" />
        <FabricText v-model="author" />
      </FabricCanvas>
    </div>

    <aside class="flex flex-col gap-6 rounded-2xl border border-slate-900 bg-slate-950/80 p-5 text-sm text-slate-100">
      <header class="space-y-2">
        <h2 class="text-base font-semibold text-slate-100">
          Text Playground
        </h2>
        <p class="text-xs leading-relaxed text-slate-400">
          Bind text props directly to form controls and tweak the fabric text node live. Drag the text on canvas or type in the
          controls to keep data in sync.
        </p>
      </header>

      <section class="space-y-2">
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Copy</span>
          <textarea
            v-model="copy.text"
            class="min-h-[90px] rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-slate-600 focus:outline-none"
          />
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Author</span>
          <input
            v-model="author.text"
            class="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-slate-600 focus:outline-none"
            type="text"
          >
        </label>
      </section>

      <section class="space-y-3">
        <div class="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
          Typography
          <span class="text-[11px] text-slate-400">
            {{ copy.fontSize }} px
          </span>
        </div>
        <input v-model.number="copy.fontSize" class="w-full accent-slate-100" max="96" min="24" step="1" type="range">

        <div class="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
          Line Height
          <span class="text-[11px] text-slate-400">
            {{ copy.lineHeight }}
          </span>
        </div>
        <input v-model.number="copy.lineHeight" class="w-full accent-slate-100" max="2" min="0.8" step="0.05" type="range">

        <div class="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
          Rotation
          <span class="text-[11px] text-slate-400">
            {{ copy.angle }}°
          </span>
        </div>
        <input v-model.number="copy.angle" class="w-full accent-slate-100" max="20" min="-20" step="1" type="range">
      </section>

      <section class="space-y-2">
        <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Alignment</span>
        <div class="flex gap-2">
          <button
            v-for="align in alignments"
            :key="align"
            class="flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold capitalize transition"
            :class="copy.textAlign === align
              ? 'border-slate-300 bg-slate-100 text-slate-900'
              : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-100'"
            type="button"
            @click="copy.textAlign = align"
          >
            {{ align }}
          </button>
        </div>
      </section>

      <section class="space-y-3">
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Fill</span>
          <div class="flex items-center gap-3">
            <input v-model="copy.fill" class="h-9 w-16 cursor-pointer rounded border border-slate-800" type="color">
            <span class="text-xs text-slate-400">{{ copy.fill }}</span>
          </div>
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-slate-500">Background</span>
          <input
            v-model="backgroundUrl"
            class="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 focus:border-slate-600 focus:outline-none"
            placeholder="Remote image URL"
            type="url"
          >
        </label>

        <label class="flex items-center gap-3 text-xs text-slate-300">
          <input v-model="showGrid" class="h-4 w-4 rounded border-slate-700 bg-slate-900" type="checkbox">
          Overlay layout grid
        </label>
      </section>

      <section class="rounded-lg border border-slate-900 bg-slate-950 p-4 text-xs text-slate-300 shadow-inner">
        <p class="mb-2 font-semibold text-slate-200">
          Current gradient swatch
        </p>
        <div class="h-12 w-full rounded-md border border-slate-800" :style="{ backgroundImage: gradient }" />
      </section>
    </aside>
  </div>
</template>
