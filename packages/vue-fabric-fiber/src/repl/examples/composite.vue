<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { computed, ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText, RenderGroup } from 'vue-fabric-fiber'

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

const primaryBackdropImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80',
  width: 960,
  height: 560,
  selectable: false,
  hasControls: false,
})

const blendedOverlayImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  width: 640,
  left: 320,
  top: 120,
  selectable: false,
  hasControls: false,
  opacity: 0.35,
})

interface HighlightEntry {
  id: string
  model: FabricImageModelValue
}

const highlightPhotos = ref<HighlightEntry[]>([
  {
    id: 'north',
    model: {
      src: 'https://images.unsplash.com/photo-1502767089025-6572583495b0?auto=format&fit=crop&w=900&q=80',
      top: 150,
      left: 180,
      width: 220,
      selectable: true,
      hasControls: true,
      angle: -8,
    },
  },
  {
    id: 'central',
    model: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      top: 260,
      left: 340,
      width: 240,
      selectable: true,
      hasControls: true,
      angle: 5,
    },
  },
  {
    id: 'south',
    model: {
      src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
      top: 340,
      left: 520,
      width: 220,
      selectable: true,
      hasControls: true,
      angle: -2,
    },
  },
])

const highlightCount = computed(() => {
  return showHighlights.value ? highlightPhotos.value.length : 0
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-12">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute -left-10 top-6 h-72 w-72 rounded-full bg-purple-500/20 blur-[180px]" />
      <div aria-hidden="true" class="absolute right-[-120px] bottom-[-60px] h-80 w-80 rounded-full bg-cyan-500/15 blur-[170px]" />
      <div class="relative max-w-3xl space-y-5">
        <span class="eyebrow">Layered composition</span>
        <h1 class="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
          Orchestrate async assets with RenderGroup queues
        </h1>
        <p class="text-sm leading-relaxed text-slate-300 sm:text-base">
          Group Fabric objects into deterministic stacks that stay in sync—even when images stream in at different times. Flip
          overlays and HUD layers without sacrificing z-order or transition smoothness.
        </p>
        <div class="flex flex-wrap gap-3 text-xs text-slate-400">
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-purple-300" />
            Nested RenderGroup orchestration
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-cyan-300" />
            Toggle layers without flicker
          </span>
        </div>
      </div>
    </section>

    <div class="grid gap-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div class="relative overflow-hidden rounded-[32px] surface-panel p-6 sm:p-8">
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-cyan-400/15" />
        <div class="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-[#020617]/95 shadow-[0_44px_100px_-52px_rgba(15,23,42,0.96)]">
          <FabricCanvas :canvas-options="{ width: 960, height: 560, backgroundColor: '#020617', preserveObjectStacking: true }">
            <RenderGroup>
              <FabricImage v-model="primaryBackdropImage" preset="background" />
              <FabricImage v-model="blendedOverlayImage" preset="overlay" />
            </RenderGroup>

            <RenderGroup v-if="showHighlights">
              <FabricImage
                v-for="photo in highlightPhotos"
                :key="photo.id"
                v-model="photo.model"
                preset="overlay"
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
      </div>

      <aside class="surface-panel-muted flex flex-col gap-6 rounded-[32px] p-6 text-sm text-slate-100 sm:p-7">
        <header class="space-y-3">
          <span class="eyebrow">Layer toggles</span>
          <h2 class="text-lg font-semibold text-slate-100">
            Layered composition
          </h2>
          <p class="text-xs leading-relaxed text-slate-400">
            Stack RenderGroups to orchestrate async assets. Toggle layers to see how the queue isolates backgrounds, highlights, and
            HUD overlays without flicker.
          </p>
        </header>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <label class="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/70 px-4 py-3 text-xs font-medium uppercase tracking-[0.3em] text-slate-300">
            Highlight photos
            <input v-model="showHighlights" class="h-4 w-4 rounded border-slate-700 bg-slate-950" type="checkbox">
          </label>
          <label class="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/70 px-4 py-3 text-xs font-medium uppercase tracking-[0.3em] text-slate-300">
            Callout labels
            <input v-model="showCallouts" class="h-4 w-4 rounded border-slate-700 bg-slate-950" type="checkbox">
          </label>
          <label class="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/70 px-4 py-3 text-xs font-medium uppercase tracking-[0.3em] text-slate-300">
            HUD overlay
            <input v-model="showHUD" class="h-4 w-4 rounded border-slate-700 bg-slate-950" type="checkbox">
          </label>
        </section>

        <section class="rounded-2xl border border-slate-800/60 bg-slate-950/75 p-4 text-xs text-slate-300 shadow-inner">
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
  </div>
</template>
