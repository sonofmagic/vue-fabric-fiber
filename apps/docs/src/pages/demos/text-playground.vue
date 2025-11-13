<script setup lang="ts">
import type { DemoCardSlug } from './cards'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DemoPageIntro from '@/components/demos/DemoPageIntro.vue'
import TextPlaygroundDemo from '@/components/demos/TextPlaygroundDemo.vue'
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
  helper: t(`demos.detail.helpers.${slug}`),
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
  <div class="mx-auto flex max-w-6xl flex-col gap-10 px-2 pb-16 sm:px-4 lg:px-0">
    <DemoPageIntro
      :title="card.title"
      :description="card.description"
      :helper="card.helper"
      :tags="card.tags"
    />
    <TextPlaygroundDemo />
  </div>
</template>
