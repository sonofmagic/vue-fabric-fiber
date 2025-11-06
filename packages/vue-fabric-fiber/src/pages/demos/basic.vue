<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from '~/index'
import { ref, watch } from 'vue'
import { FabricCanvas, FabricImage, FabricText } from '~/index'

const heroImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1529280458970-8da337920c90?auto=format&fit=crop&w=1280&q=80',
  width: 960,
  height: 540,
  selectable: false,
  hasControls: false,
})

const selectionEnabled = ref(true)

const headline = ref<FabricTextModelValue>({
  text: 'Fabric Showcase',
  left: 120,
  top: 120,
  fontSize: 90,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#f9fafb',
  selectable: selectionEnabled.value,
})

const tagline = ref<FabricTextModelValue>({
  text: 'Composable canvas primitives for Vue',
  left: 120,
  top: 240,
  fontSize: 36,
  fontFamily: 'Inter',
  fontWeight: '500',
  fill: '#cbd5f5',
  stroke: '#0f172a',
  strokeWidth: 0.5,
  selectable: selectionEnabled.value,
})

const accentColors = ['#fbbf24', '#38bdf8', '#f472b6', '#4ade80']

watch(selectionEnabled, (enabled) => {
  headline.value.selectable = enabled
  tagline.value.selectable = enabled
})

function setAccent(color: string) {
  headline.value.fill = color
  tagline.value.fill = `${color}dd`
}

function randomizeLayout() {
  headline.value.left = 80 + Math.random() * 120
  headline.value.top = 80 + Math.random() * 80
  tagline.value.left = headline.value.left
  tagline.value.top = headline.value.top + 120 + Math.random() * 20
}

function toggleGuides() {
  selectionEnabled.value = !selectionEnabled.value
}
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-12">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute -left-12 top-8 h-60 w-60 rounded-full bg-amber-400/20 blur-[160px]" />
      <div aria-hidden="true" class="absolute right-10 bottom-[-80px] h-72 w-72 rounded-full bg-cyan-500/20 blur-[150px]" />
      <div class="relative max-w-3xl space-y-5">
        <span class="eyebrow">Hero banner</span>
        <h1 class="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
          Design a marketing hero in real time
        </h1>
        <p class="text-sm leading-relaxed text-slate-300 sm:text-base">
          Swap imagery, retheme typography, and fine-tune layout controls while Fabric keeps the canvas reactive. Experiment with
          asynchronous assets without losing selection state or stacking order.
        </p>
        <div class="flex flex-wrap gap-3 text-xs text-slate-400">
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-emerald-400" />
            Live selection toggles
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-sky-400" />
            Reactive layout shuffles
          </span>
        </div>
      </div>
    </section>

    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div class="relative overflow-hidden rounded-[32px] surface-panel p-6 sm:p-8">
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-amber-300/10 via-transparent to-sky-400/10" />
        <div class="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/85 shadow-[0_40px_90px_-46px_rgba(15,23,42,0.92)]">
          <FabricCanvas :canvas-options="{ width: 960, height: 540, preserveObjectStacking: true }">
            <FabricImage v-model="heroImage" preset="background" />
            <FabricText v-model="headline" />
            <FabricText v-model="tagline" />
          </FabricCanvas>
        </div>
      </div>

      <aside class="surface-panel-muted flex flex-col gap-6 rounded-[32px] p-6 text-sm text-slate-100 sm:p-7">
        <section class="space-y-2">
          <span class="eyebrow">Control panel</span>
          <h2 class="text-lg font-semibold text-slate-100">
            Hero banner
          </h2>
          <p class="text-xs leading-relaxed text-slate-400">
            Toggle interactivity or reshape the layout to see how Fabric responds. Changes apply instantly to the canvas objects.
          </p>
        </section>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Canvas settings
          </h3>
          <label class="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/70 px-4 py-3 text-xs text-slate-200">
            Enable object selection
            <input v-model="selectionEnabled" type="checkbox" class="h-4 w-4 rounded border-slate-700 bg-slate-950">
          </label>
          <div class="flex flex-wrap gap-3">
            <button
              class="flex-1 rounded-xl border border-slate-800/60 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
              type="button"
              @click="randomizeLayout"
            >
              Shuffle layout
            </button>
            <button
              class="flex-1 rounded-xl border border-slate-800/60 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
              type="button"
              @click="toggleGuides"
            >
              Toggle guides
            </button>
          </div>
        </section>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Accent palette
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="color in accentColors"
              :key="color"
              class="relative h-10 w-10 rounded-full border border-slate-800/60 transition hover:scale-105"
              :style="{ backgroundColor: color }"
              type="button"
              @click="setAccent(color)"
            >
              <span class="absolute inset-0 rounded-full border border-white/20 opacity-0 transition hover:opacity-60" />
            </button>
          </div>
        </section>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Background image
          </h3>
          <input
            v-model="heroImage.src"
            class="w-full rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 focus:border-slate-600 focus:outline-none"
            placeholder="Image URL"
            type="url"
          >
          <p class="text-[11px] leading-snug text-slate-500">
            Paste any remote image URL to rebuild the canvas background in-place.
          </p>
        </section>
      </aside>
    </div>
  </div>
</template>
