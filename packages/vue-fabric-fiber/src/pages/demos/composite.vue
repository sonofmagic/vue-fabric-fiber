<script setup lang="ts">
import type { DemoCardSlug } from './cards'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DemoRepl from '@/components/DemoRepl.vue'
import CompositeSource from '@/repl/examples/composite.vue?raw'
import { buildCanonicalUrl, usePageSeo } from '@/seo'
import { demoCards } from './cards'

const slug: DemoCardSlug = 'composite'
const definition = demoCards.find(entry => entry.slug === slug)

if (!definition) {
  throw new Error('Missing demo card metadata for /demos/composite')
}

const codePath = 'src/repl/examples/composite.vue'
const { t, tm } = useI18n()

const card = computed(() => ({
  ...definition,
  title: t(definition.titleKey),
  description: t(definition.descriptionKey),
  tags: (definition.tagKeys ?? []).map(tag => t(`demos.tags.${tag}`)),
}))

const helperText = computed(() => t(`demos.detail.helpers.${slug}`))
const note = computed(() => tm(`demos.detail.notes.${slug}`) as { intro: string, outro: string })

usePageSeo({
  title: () => card.value.title,
  description: () => `${card.value.description} ${helperText.value}`.trim(),
  canonicalPath: definition.to,
  keywords: () => card.value.tags,
  structuredData: () => ({
    '@type': 'TechArticle',
    'name': card.value.title,
    'headline': card.value.title,
    'description': `${card.value.description} ${helperText.value}`.trim(),
    'url': buildCanonicalUrl(definition.to),
  }),
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-10">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-emerald-400/10" />
      <div class="relative space-y-5">
        <span class="eyebrow">{{ t('demos.detail.common.eyebrow') }}</span>
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
          {{ note.intro }}<code class="font-mono text-slate-200">{{ codePath }}</code>{{ note.outro }}
        </p>
      </div>
    </section>

    <DemoRepl :height="880" :source="CompositeSource" filename="examples/composite.vue" />
  </div>
</template>
