<script setup lang="ts">
import DemoRepl from '@/components/DemoRepl.vue'
import BasicSource from '@/repl/examples/basic.vue?raw'
import { demoCards } from './cards'

const card = demoCards.find(entry => entry.to === '/demos/basic')

if (!card) {
  throw new Error('Missing demo card metadata for /demos/basic')
}

const codePath = 'src/repl/examples/basic.vue'
const helperText = 'Swap hero art, typography, and selection props in the editor while the Fabric canvas stays reactive.'
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-10">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-amber-300/20 via-transparent to-sky-400/10" />
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
          Code lives in <code class="font-mono text-slate-200">{{ codePath }}</code>. Edit it inside the embedded <span class="font-semibold text-slate-200">@vue/repl</span> to
          inspect both source and canvas output simultaneously.
        </p>
      </div>
    </section>

    <DemoRepl :height="860" :source="BasicSource" filename="examples/basic.vue" />
  </div>
</template>
