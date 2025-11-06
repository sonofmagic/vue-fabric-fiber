<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from '~/index'
import JsonEditorVue from 'json-editor-vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { FabricCanvas, FabricImage, FabricText, RenderGroup } from '~/index'

import { demoCards } from './demos/cards'

const featuredDemos = demoCards.slice(0, 4)

const textArray = ref<Omit<FabricTextModelValue, 'clipPath' | 'canvas' | 'path'>[]>([
  {
    text: '你好☄️Hello World',
    left: 80,
    top: 120,
    fontSize: 72,
    fill: '#f5f5f4',
    fontFamily: 'Inter',
    fontWeight: '700',
    shadow: null,
  },
  {
    text: 'Fabric objects stay reactive.',
    left: 180,
    top: 320,
    fontSize: 42,
    fill: '#38bdf8',
    fontFamily: 'Inter',
    fontWeight: '500',
  },
])

const renderGroupTitle: FabricTextModelValue = {
  text: 'RenderGroup preserves order',
  left: 120,
  top: 360,
  fontSize: 32,
  fill: '#f59e0b',
  fontFamily: 'Inter',
  selectable: false,
}

const renderGroupGreeting: FabricTextModelValue = {
  text: '你好',
  left: 200,
  top: 260,
  fontSize: 54,
  fill: '#f8fafc',
}

const heroCanvasImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
  width: 720,
  height: 480,
  selectable: false,
  hasControls: false,
})

const accentPortraitImage = ref<FabricImageModelValue>({
  src: 'https://picsum.photos/200/200',
  width: 180,
  left: 140,
  top: 220,
  selectable: true,
  hasControls: true,
})

const heroHighlights = [
  {
    title: 'Scene composition stays declarative',
    description: 'Layer Fabric objects through RenderGroup queues while keeping pure Vue templates. Swap imagery or text without imperatively reordering items.',
  },
  {
    title: 'Two-way bindings everywhere',
    description: 'Drag handles on canvas or tweak panel inputs—the reactive model keeps Fabric properties synchronised in real time.',
  },
  {
    title: 'Types guide every prop',
    description: 'Ship confidently with fully typed Fabric bindings. Optional props surface completions while guarding against shape mismatches.',
  },
]

const heroStats = [
  { label: 'Bindings', value: 'Fabric.js primitives' },
  { label: 'DX Focus', value: 'Vue 3 + TypeScript' },
  { label: 'Interaction', value: 'Realtime sync' },
]
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-16">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-12 sm:px-10 sm:py-14">
      <div aria-hidden="true" class="absolute -right-20 top-10 h-60 w-60 rounded-full bg-cyan-400/25 blur-[140px]" />
      <div aria-hidden="true" class="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-purple-500/20 blur-[160px]" />
      <div class="relative grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div class="space-y-8">
          <span class="eyebrow">Vue + Fabric.js</span>
          <div class="space-y-4">
            <h1 class="text-3xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-4xl lg:text-5xl">
              Compose Fabric canvases with Vue-first ergonomics
            </h1>
            <p class="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Craft interactive design tooling without leaving the Vue mindset. Fabric Ports wraps Fabric.js primitives with typed
              components, so dragging on canvas and tweaking in forms always stay in sync.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <RouterLink
              class="inline-flex items-center gap-3 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-200"
              to="/demos/basic"
            >
              Explore hero builder
              <span aria-hidden="true">↗</span>
            </RouterLink>
            <RouterLink
              class="inline-flex items-center gap-3 rounded-full border border-slate-700/70 bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-slate-100"
              to="/demos/text-playground"
            >
              Typography canvas
            </RouterLink>
          </div>
          <dl class="grid gap-4 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="stat in heroStats"
              :key="stat.label"
              class="rounded-2xl border border-slate-800/60 bg-slate-900/55 px-4 py-5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.85)]"
            >
              <dt class="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                {{ stat.label }}
              </dt>
              <dd class="mt-2 text-lg font-semibold text-slate-100">
                {{ stat.value }}
              </dd>
            </div>
          </dl>
        </div>
        <div class="space-y-4 rounded-[28px] border border-slate-800/60 bg-slate-950/60 p-6 shadow-[0_30px_90px_-50px_rgba(8,47,73,0.85)] backdrop-blur-xl">
          <h2 class="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">
            Why Fabric Ports
          </h2>
          <ul class="space-y-4 text-sm text-slate-300">
            <li
              v-for="highlight in heroHighlights"
              :key="highlight.title"
              class="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4"
            >
              <p class="text-sm font-medium text-slate-100">
                {{ highlight.title }}
              </p>
              <p class="mt-2 text-xs leading-relaxed text-slate-400">
                {{ highlight.description }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div class="relative overflow-hidden rounded-[32px] surface-panel p-6 sm:p-8">
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div class="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/85 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.9)]">
          <FabricCanvas :canvas-options="{ width: 720, height: 480, preserveObjectStacking: true }">
            <FabricImage v-model="heroCanvasImage" preset="background" />
            <template v-for="(_, idx) in textArray" :key="idx">
              <FabricText v-model="textArray[idx]" />
            </template>

            <RenderGroup>
              <FabricText
                :model-value="renderGroupTitle"
              />
              <FabricImage v-model="accentPortraitImage" preset="overlay" />
              <FabricText
                :model-value="renderGroupGreeting"
              />
            </RenderGroup>
          </FabricCanvas>
        </div>
      </div>

      <div class="surface-panel-muted flex flex-col gap-5 rounded-[32px] p-6 sm:p-7 text-sm text-slate-100">
        <header class="space-y-3">
          <span class="eyebrow">Canvas inspector</span>
          <h2 class="text-xl font-semibold text-slate-100">
            Fabric Ports Demo Hub
          </h2>
          <p class="text-xs leading-relaxed text-slate-400">
            Use the JSON editor to tweak attributes or drag nodes directly on canvas. The reactive stores ensure updates flow in both
            directions.
          </p>
        </header>
        <JsonEditorVue v-model="textArray" class="h-full min-h-[280px] rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4 text-xs text-slate-200 shadow-inner shadow-slate-950/30" />
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span class="eyebrow">Explore</span>
          <h2 class="mt-3 text-2xl font-semibold text-slate-100">
            Demo gallery
          </h2>
        </div>
        <div class="flex flex-col gap-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
          <p class="max-w-xl">
            Dive into specialised canvases to test typography bindings, layer async assets, or compose geometric primitives. Each demo
            mirrors production-grade configurations.
          </p>
          <RouterLink
            class="group inline-flex w-fit items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-slate-600 hover:text-slate-100"
            to="/demos"
          >
            View all demos
            <span aria-hidden="true" class="transition group-hover:translate-x-0.5">→</span>
          </RouterLink>
        </div>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <RouterLink
          v-for="route in featuredDemos"
          :key="route.to"
          :to="route.to"
          class="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-slate-800/60 bg-slate-950/70 p-6 transition hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900/70"
        >
          <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 transition group-hover:opacity-100" />
          <div class="relative space-y-3">
            <h3 class="text-lg font-medium text-slate-100">
              {{ route.title }}
            </h3>
            <p class="text-xs leading-relaxed text-slate-400">
              {{ route.description }}
            </p>
          </div>
          <span class="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 transition group-hover:text-slate-100">
            View demo
            <span aria-hidden="true" class="transition group-hover:translate-x-1">→</span>
          </span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
