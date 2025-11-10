<script setup lang="ts">
import DemoRepl from '@/components/DemoRepl.vue'
import PlaygroundSource from '@/repl/examples/playground.vue?raw'
import { buildCanonicalUrl, usePageSeo } from '@/seo'
import { demoCards } from './cards'

const card = demoCards.find(entry => entry.to === '/demos/playground')

if (!card) {
  throw new Error('Missing demo card metadata for /demos/playground')
}

const codePath = 'src/repl/examples/playground.vue'
const helperText = 'Paste JSON scene descriptions, switch presets, and watch Fabric render instructions derived from the data layer.'

if (card) {
  usePageSeo({
    title: card.title,
    description: `${card.description} ${helperText}`,
    canonicalPath: card.to,
    keywords: card.tags,
    structuredData: () => ({
      '@type': 'TechArticle',
      name: card.title,
      headline: card.title,
      description: `${card.description} ${helperText}`,
      url: buildCanonicalUrl(card.to),
    }),
  })
}
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-10">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-violet-400/10" />
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
          The editor loads <code class="font-mono text-slate-200">{{ codePath }}</code> so you can iterate on the scene blueprint that powers the controls.
        </p>
      </div>
    </section>

    <DemoRepl :height="980" :source="PlaygroundSource" filename="examples/playground.vue" />
  </div>
</template>
