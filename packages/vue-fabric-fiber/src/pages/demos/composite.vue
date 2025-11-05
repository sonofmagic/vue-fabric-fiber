<script setup lang="ts">
import type { FabricTextModelValue } from '~/index'
import { computed, ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText, RenderGroup } from '~/index'

const showHighlights = ref(true)
const showHUD = ref(true)
const showCallouts = ref(true)

const overlayTitle = ref<FabricTextModelValue>({
  text: 'Night City Transit Map',
  left: 60,
  top: 32,
  fontSize: 44,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#e2e8f0',
  selectable: false,
})

const overlaySubtitle = ref<FabricTextModelValue>({
  text: 'RenderGroup keeps async assets in sync, even across nested layers.',
  left: 60,
  top: 92,
  fontSize: 20,
  fontFamily: 'Inter',
  fill: '#94a3b8',
  width: 600,
  selectable: false,
})

const hudStats = ref<FabricTextModelValue>({
  text: 'Lines: 12  |  Active Trains: 87  |  Avg Wait: 04:12',
  left: 60,
  top: 520,
  fontSize: 22,
  fontFamily: 'JetBrains Mono',
  fill: '#38bdf8',
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  padding: 12,
  selectable: false,
})

interface CalloutEntry {
  id: string
  model: FabricTextModelValue
}

const callouts = ref<CalloutEntry[]>([
  {
    id: 'uptown',
    model: {
      text: 'Uptown Launchpad',
      left: 640,
      top: 180,
      fontSize: 22,
      fill: '#22d3ee',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'harbor',
    model: {
      text: 'Harbor Freight Hub',
      left: 560,
      top: 320,
      fontSize: 22,
      fill: '#fbbf24',
      fontFamily: 'Inter',
    },
  },
])

const highlightPhotos = [
  {
    id: 'north',
    src: 'https://images.unsplash.com/photo-1502767089025-6572583495b0?auto=format&fit=crop&w=900&q=80',
    top: 150,
    left: 180,
    width: 220,
    selectable: true,
    angle: -8,
  },
  {
    id: 'central',
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    top: 260,
    left: 340,
    width: 240,
    selectable: true,
    angle: 5,
  },
  {
    id: 'south',
    src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
    top: 340,
    left: 520,
    width: 220,
    selectable: true,
    angle: -2,
  },
] as const

const highlightCount = computed(() => {
  return showHighlights.value ? highlightPhotos.length : 0
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-10 py-6 xl:flex-row">
    <div class="rounded-3xl border border-slate-900 bg-slate-950/80 p-6 shadow-2xl">
      <FabricCanvas :canvas-options="{ width: 960, height: 560, backgroundColor: '#020617', preserveObjectStacking: true }">
        <RenderGroup>
          <FabricImage
            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80"
            width="960"
            height="560"
            :selectable="false"
            :has-controls="false"
          />
          <FabricImage
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
            width="640"
            :left="320"
            :top="120"
            :has-controls="false"
            :selectable="false"
            :opacity="0.35"
          />
        </RenderGroup>

        <RenderGroup v-if="showHighlights">
          <FabricImage
            v-for="photo in highlightPhotos"
            :key="photo.id"
            :src="photo.src"
            :left="photo.left"
            :top="photo.top"
            :width="photo.width"
            :selectable="photo.selectable"
            :has-controls="true"
            :angle="photo.angle"
          />
        </RenderGroup>

        <RenderGroup v-if="showCallouts">
          <FabricText
            v-for="callout in callouts"
            :key="callout.id"
            v-model="callout.model"
          />
        </RenderGroup>

        <RenderGroup>
          <FabricText v-model="overlayTitle" />
          <FabricText v-model="overlaySubtitle" />
        </RenderGroup>

        <RenderGroup v-if="showHUD">
          <FabricText v-model="hudStats" />
        </RenderGroup>
      </FabricCanvas>
    </div>

    <aside class="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-slate-900 bg-slate-950/85 p-6 text-sm text-slate-100">
      <header class="space-y-2">
        <h2 class="text-base font-semibold text-slate-100">
          Layered Composition
        </h2>
        <p class="text-xs leading-relaxed text-slate-400">
          Stack RenderGroups to orchestrate async assets. Toggle layers to see how the queue isolates background, highlights,
          and HUD overlays without flicker.
        </p>
      </header>

      <section class="space-y-3">
        <label class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-300">
          Highlight Photos
          <input v-model="showHighlights" class="h-4 w-4 rounded border-slate-700 bg-slate-900" type="checkbox">
        </label>
        <label class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-300">
          Callout Labels
          <input v-model="showCallouts" class="h-4 w-4 rounded border-slate-700 bg-slate-900" type="checkbox">
        </label>
        <label class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-300">
          HUD Overlay
          <input v-model="showHUD" class="h-4 w-4 rounded border-slate-700 bg-slate-900" type="checkbox">
        </label>
      </section>

      <section class="rounded-xl border border-slate-900 bg-slate-950 p-4 text-xs text-slate-300 shadow-inner">
        <p class="mb-2 font-semibold text-slate-200">
          Rendered highlights
        </p>
        <p>
          {{ highlightCount }} interactive photos on stage
        </p>
        <p class="mt-2 text-[11px] leading-relaxed text-slate-500">
          Each photo is its own FabricImage instance so you can test control handles, selection rules, and stacking order.
        </p>
      </section>
    </aside>
  </div>
</template>
