<script setup lang="ts">
import type { HomeHeroHighlight, HomeHeroStat } from '@/types/home'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FeaturedDemosSection from '@/components/home/FeaturedDemosSection.vue'
import HeroShowcaseSection from '@/components/home/HeroShowcaseSection.vue'
import InteractiveComposer from '@/components/home/InteractiveComposer.vue'
import { useHeroScene } from '@/composables/useHeroScene'
import { buildCanonicalUrl, SITE_NAME, usePageSeo } from '@/seo'
import { demoCards } from './demos/cards'

const { t, tm, locale } = useI18n()
const heroScene = useHeroScene({ t, tm, locale })

const featuredDefinitions = demoCards.slice(0, 4)
const featuredDemos = computed(() => {
  return featuredDefinitions.map(card => ({
    ...card,
    title: t(card.titleKey),
    description: t(card.descriptionKey),
  }))
})

const heroHighlights = computed(() => tm('home.hero.highlights') as HomeHeroHighlight[])
const heroStats = computed(() => tm('home.hero.stats') as HomeHeroStat[])

usePageSeo({
  title: () => t('home.meta.title'),
  description: () => t('home.meta.description'),
  keywords: () => tm('home.meta.keywords') as string[],
  structuredData: () => ({
    '@type': 'WebSite',
    'name': SITE_NAME,
    'url': buildCanonicalUrl('/'),
    'description': t('home.meta.description'),
  }),
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-16">
    <HeroShowcaseSection
      :hero-highlights="heroHighlights"
      :hero-stats="heroStats"
      :inspector-layers="heroScene.inspectorLayers"
    />

    <InteractiveComposer :scene="heroScene" />

    <FeaturedDemosSection :featured-demos="featuredDemos" />
  </div>
</template>
