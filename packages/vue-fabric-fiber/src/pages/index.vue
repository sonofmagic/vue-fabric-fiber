<script setup lang="ts">
import type { FabricTextModelValue } from '~/index'
import JsonEditorVue from 'json-editor-vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { FabricCanvas, FabricImage, FabricText, RenderGroup } from '~/index'

const cardRoutes = [
  {
    to: '/demos/basic',
    title: 'Basic Hero Banner',
    description: 'Layer text on top of asynchronous imagery and tweak layout controls in real time.',
  },
  {
    to: '/demos/text-playground',
    title: 'Interactive Typography',
    description: 'Directly bind fabric text props to form inputs and keep canvas edits in sync.',
  },
  {
    to: '/demos/composite',
    title: 'Layered Composition',
    description: 'Combine RenderGroup queues to orchestrate complex scenes with toggled layers.',
  },
  {
    to: '/demos/shapes',
    title: 'Shape Toolkit',
    description: 'Rectangles, polylines, paths, and more using the Fabric shape components.',
  },
]

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
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-12 py-10">
    <section class="grid gap-8 lg:grid-cols-[3fr_2fr]">
      <div class="rounded-3xl border border-slate-900 bg-slate-950/70 p-6 shadow-xl">
        <FabricCanvas :canvas-options="{ width: 720, height: 480, preserveObjectStacking: true }">
          <FabricImage src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80" width="720" height="480" :selectable="false" :has-controls="false" />
          <template v-for="(_, idx) in textArray" :key="idx">
            <FabricText v-model="textArray[idx]" />
          </template>

          <RenderGroup>
            <FabricText
              :model-value="renderGroupTitle"
            />
            <FabricImage src="https://picsum.photos/200/200" :width="180" :left="140" :top="220" />
            <FabricText
              :model-value="renderGroupGreeting"
            />
          </RenderGroup>
        </FabricCanvas>
      </div>

      <div class="flex flex-col gap-4 rounded-2xl border border-slate-900 bg-slate-950/80 p-5 text-sm text-slate-100">
        <header class="space-y-3">
          <h1 class="text-2xl font-semibold text-slate-100">
            Fabric Ports Demo Hub
          </h1>
          <p class="text-xs leading-relaxed text-slate-400">
            Use the panels to the right to edit any text node. Drag objects directly on the Fabric canvas and inspect the JSON
            payload to understand what the components emit.
          </p>
        </header>
        <JsonEditorVue v-model="textArray" class="h-full min-h-[260px] rounded-xl border border-slate-900 bg-slate-950/60 p-3 text-xs text-slate-200" />
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-slate-100">
        Demo Gallery
      </h2>
      <div class="grid gap-4 md:grid-cols-2">
        <RouterLink
          v-for="route in cardRoutes"
          :key="route.to"
          :to="route.to"
          class="flex h-full flex-col justify-between rounded-2xl border border-slate-900 bg-slate-950/70 p-5 transition hover:border-slate-600 hover:bg-slate-900/60"
        >
          <div class="space-y-2">
            <h3 class="text-base font-medium text-slate-100">
              {{ route.title }}
            </h3>
            <p class="text-xs leading-relaxed text-slate-400">
              {{ route.description }}
            </p>
          </div>
          <span class="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            View demo →
          </span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
