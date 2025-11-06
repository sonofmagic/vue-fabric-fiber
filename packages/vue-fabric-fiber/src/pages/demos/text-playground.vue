<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from '~/index'
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

const backgroundImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80',
  width: 720,
  height: 480,
  selectable: false,
  hasControls: false,
})

const gridOverlayImage = ref<FabricImageModelValue>({
  src: 'https://i.imgur.com/kze6PzT.png',
  width: 720,
  height: 480,
  left: 0,
  top: 0,
  selectable: false,
  hasControls: false,
  opacity: 0.45,
})

const showGrid = ref(true)
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-12">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute -right-24 top-6 h-64 w-64 rounded-full bg-sky-400/20 blur-[150px]" />
      <div aria-hidden="true" class="absolute left-16 bottom-[-90px] h-72 w-72 rounded-full bg-emerald-400/10 blur-[150px]" />
      <div class="relative max-w-3xl space-y-5">
        <span class="eyebrow">Typography playground</span>
        <h1 class="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
          Pair form controls with Fabric text in perfect sync
        </h1>
        <p class="text-sm leading-relaxed text-slate-300 sm:text-base">
          Bind text props directly to Vue inputs and watch the canvas update every keystroke. Swap copy, alignments, and fill styles
          while preserving Fabric’s editing affordances.
        </p>
        <div class="flex flex-wrap gap-3 text-xs text-slate-400">
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-sky-300" />
            Range sliders drive Fabric props
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-amber-300" />
            Canvas edits feed back to forms
          </span>
        </div>
      </div>
    </section>

    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div class="relative overflow-hidden rounded-[32px] surface-panel p-6 sm:p-8">
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-sky-400/15 via-transparent to-indigo-500/10" />
        <div class="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/85 shadow-[0_40px_90px_-46px_rgba(15,23,42,0.92)]">
          <FabricCanvas :canvas-options="{ width: 720, height: 480, preserveObjectStacking: true }">
            <FabricImage v-model="backgroundImage" preset="background" />
            <FabricImage
              v-if="showGrid"
              v-model="gridOverlayImage"
              preset="overlay"
            />
            <FabricText v-model="copy" />
            <FabricText v-model="author" />
          </FabricCanvas>
        </div>
      </div>

      <aside class="surface-panel-muted flex flex-col gap-6 rounded-[32px] p-6 text-sm text-slate-100 sm:p-7">
        <header class="space-y-3">
          <span class="eyebrow">Control panel</span>
          <h2 class="text-lg font-semibold text-slate-100">
            Text playground
          </h2>
          <p class="text-xs leading-relaxed text-slate-400">
            Bind Fabric text nodes to Vue form fields. Drag on canvas or update inputs below—the reactive model stays in sync.
          </p>
        </header>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Copy</span>
            <textarea
              v-model="copy.text"
              class="min-h-[96px] rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-slate-600 focus:outline-none"
            />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Author</span>
            <input
              v-model="author.text"
              class="rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-slate-600 focus:outline-none"
              type="text"
            >
          </label>
        </section>

        <section class="space-y-4 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Typography
            <span class="text-[11px] text-slate-500">
              {{ copy.fontSize }} px
            </span>
          </div>
          <input v-model.number="copy.fontSize" class="w-full accent-slate-100" max="96" min="24" step="1" type="range">

          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Line height
            <span class="text-[11px] text-slate-500">
              {{ copy.lineHeight }}
            </span>
          </div>
          <input v-model.number="copy.lineHeight" class="w-full accent-slate-100" max="2" min="0.8" step="0.05" type="range">

          <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Rotation
            <span class="text-[11px] text-slate-500">
              {{ copy.angle }}°
            </span>
          </div>
          <input v-model.number="copy.angle" class="w-full accent-slate-100" max="20" min="-20" step="1" type="range">
        </section>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Alignment</span>
          <div class="flex gap-2">
            <button
              v-for="align in alignments"
              :key="align"
              class="flex-1 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition"
              :class="copy.textAlign === align
                ? 'border-slate-200 bg-slate-100 text-slate-900'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-100'"
              type="button"
              @click="copy.textAlign = align"
            >
              {{ align }}
            </button>
          </div>
        </section>

        <section class="space-y-4 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Fill</span>
            <div class="flex items-center gap-3">
              <input v-model="copy.fill" class="h-10 w-16 cursor-pointer rounded border border-slate-800/60" type="color">
              <span class="text-xs text-slate-400">{{ copy.fill }}</span>
            </div>
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Background</span>
            <input
              v-model="backgroundImage.src"
              class="rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 focus:border-slate-600 focus:outline-none"
              placeholder="Remote image URL"
              type="url"
            >
          </label>

          <label class="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/70 px-4 py-3 text-xs text-slate-300">
            <input v-model="showGrid" class="h-4 w-4 rounded border-slate-700 bg-slate-950" type="checkbox">
            Overlay layout grid
          </label>
        </section>

        <section class="rounded-2xl border border-slate-800/60 bg-slate-950/75 p-4 text-xs text-slate-300 shadow-inner">
          <p class="mb-2 font-semibold text-slate-200">
            Current gradient swatch
          </p>
          <div class="h-14 w-full rounded-xl border border-slate-800/60" :style="{ backgroundImage: gradient }" />
        </section>
      </aside>
    </div>
  </div>
</template>
