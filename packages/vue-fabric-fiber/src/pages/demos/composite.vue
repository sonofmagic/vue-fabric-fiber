<script setup lang="ts">
import DemoRepl from '@/components/DemoRepl.vue'
import CompositeSource from '@/repl/examples/composite.vue?raw'
import { demoCards } from './cards'

const card = demoCards.find(entry => entry.to === '/demos/composite')

if (!card) {
  throw new Error('Missing demo card metadata for /demos/composite')
}

const codePath = 'src/repl/examples/composite.vue'
const helperText = 'RenderGroup queues, async imagery, and toggled layers stay in sync so you can study how the bindings orchestrate complex scenes.'
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-10">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-emerald-400/10" />
      <div class="relative space-y-5">
        <span class="eyebrow">Live playground</span>
        <h1 class="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
          {{ card.title }}
        </h1>
        <p class="text-sm leading-relaxed text-slate-300 sm:text-base">
          {{ card.description }}
        </p>
        <p class="text-sm leading-relaxed text-slate-400">
          {{ helperText }}
        </p>
        <div v-if="card.tags?.length" class="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.28em] text-slate-400">
          <span
            v-for="tag in card.tags"
            :key="tag"
            class="rounded-full border border-slate-800/60 bg-slate-900/70 px-3 py-1 text-slate-300"
          >
            {{ tag }}
          </span>
        </div>
        <p class="text-xs leading-relaxed text-slate-500">
          Edit <code class="font-mono text-slate-200">{{ codePath }}</code> directly in the embedded editor to understand how each RenderGroup slot feeds the Fabric canvas.
        </p>
      </div>
    </section>

    <DemoRepl :height="880" :source="CompositeSource" filename="examples/composite.vue" />
  </div>
</template>
