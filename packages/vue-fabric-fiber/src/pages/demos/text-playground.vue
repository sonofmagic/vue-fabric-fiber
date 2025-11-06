<script setup lang="ts">
import DemoRepl from '@/components/DemoRepl.vue'
import TextPlaygroundSource from '@/repl/examples/text-playground.vue?raw'
import { demoCards } from './cards'

const card = demoCards.find(entry => entry.to === '/demos/text-playground')

if (!card) {
  throw new Error('Missing demo card metadata for /demos/text-playground')
}

const codePath = 'src/repl/examples/text-playground.vue'
const helperText = 'Bind range sliders, inputs, and toggles straight into FabricText props and see edits reflected on every keystroke.'
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-10">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-yellow-400/15 via-transparent to-cyan-400/10" />
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
          Use <code class="font-mono text-slate-200">{{ codePath }}</code> inside the REPL to tweak copy, gradients, and input bindings side by side with the rendered canvas.
        </p>
      </div>
    </section>

    <DemoRepl :height="940" :source="TextPlaygroundSource" filename="examples/text-playground.vue" />
  </div>
</template>
