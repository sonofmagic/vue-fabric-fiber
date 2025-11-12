<script setup lang="ts">
import type { DemoCardSlug } from './cards'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DemoRepl from '@/components/DemoRepl.vue'
import TextPlaygroundSource from '@/repl/examples/text-playground.vue?raw'
import { buildCanonicalUrl, usePageSeo } from '@/seo'
import { demoCards } from './cards'

const slug: DemoCardSlug = 'textPlayground'
const definition = demoCards.find(entry => entry.slug === slug)

if (!definition) {
  throw new Error('Missing demo card metadata for /demos/text-playground')
}

const { t } = useI18n()

const card = computed(() => ({
  ...definition,
  title: t(definition.titleKey),
  description: t(definition.descriptionKey),
  tags: (definition.tagKeys ?? []).map(tag => t(`demos.tags.${tag}`)),
}))

usePageSeo({
  title: () => card.value.title,
  description: () => card.value.description,
  canonicalPath: definition.to,
  keywords: () => card.value.tags,
  structuredData: () => ({
    '@type': 'TechArticle',
    'name': card.value.title,
    'headline': card.value.title,
    'description': card.value.description,
    'url': buildCanonicalUrl(definition.to),
  }),
})
</script>

<template>
  <div class="full-bleed px-2 pb-10 sm:px-4 lg:px-6">
    <DemoRepl full-height :source="TextPlaygroundSource" filename="examples/text-playground.vue" />
  </div>
</template>
