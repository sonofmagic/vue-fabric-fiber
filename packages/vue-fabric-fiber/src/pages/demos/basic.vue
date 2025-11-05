<script setup lang="ts">
import type { FabricTextModelValue } from '~/index'
import { ref, watch } from 'vue'
import { FabricCanvas, FabricImage, FabricText } from '~/index'

const heroImage = ref('https://images.unsplash.com/photo-1529280458970-8da337920c90?auto=format&fit=crop&w=1280&q=80')

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
  <div class="mx-auto flex max-w-6xl flex-col gap-10 py-6 lg:flex-row">
    <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
      <FabricCanvas :canvas-options="{ width: 960, height: 540, preserveObjectStacking: true }">
        <FabricImage :src="heroImage" width="960" height="540" :selectable="false" :has-controls="false" />
        <FabricText v-model="headline" />
        <FabricText v-model="tagline" />
      </FabricCanvas>
    </div>

    <aside class="flex w-full max-w-sm flex-col gap-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-100">
      <section class="space-y-2">
        <h2 class="text-base font-semibold text-slate-200">
          Hero Banner
        </h2>
        <p class="text-xs text-slate-400">
          Toggle interactivity or reshape the layout to see how objects respond on the Fabric canvas.
        </p>
      </section>

      <section class="space-y-2">
        <h3 class="text-xs font-medium uppercase tracking-wide text-slate-400">
          Canvas Controls
        </h3>
        <label class="flex items-center gap-3 text-sm">
          <input v-model="selectionEnabled" type="checkbox" class="h-4 w-4 rounded border-slate-700 bg-slate-900">
          Enable object selection
        </label>
        <div class="flex gap-3">
          <button
            class="rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
            type="button"
            @click="randomizeLayout"
          >
            Shuffle layout
          </button>
          <button
            class="rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
            type="button"
            @click="toggleGuides"
          >
            Toggle guides
          </button>
        </div>
      </section>

      <section class="space-y-2">
        <h3 class="text-xs font-medium uppercase tracking-wide text-slate-400">
          Accent Color
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in accentColors"
            :key="color"
            class="h-8 w-8 rounded-full border border-slate-700"
            :style="{ backgroundColor: color }"
            type="button"
            @click="setAccent(color)"
          />
        </div>
      </section>

      <section class="space-y-2">
        <h3 class="text-xs font-medium uppercase tracking-wide text-slate-400">
          Background
        </h3>
        <input
          v-model="heroImage"
          class="w-full rounded-md border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus:border-slate-600 focus:outline-none"
          placeholder="Image URL"
          type="url"
        >
        <p class="text-[11px] leading-snug text-slate-500">
          Paste any remote image URL to rebuild the canvas background in-place.
        </p>
      </section>
    </aside>
  </div>
</template>
