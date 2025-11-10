<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { buildCanonicalUrl, usePageSeo } from '@/seo'
import { demoCards } from './cards'

const { t, tm } = useI18n()

const cards = computed(() => {
  return demoCards.map((card) => ({
    ...card,
    title: t(card.titleKey),
    description: t(card.descriptionKey),
    tags: (card.tagKeys ?? []).map(tag => t(`demos.tags.${tag}`)),
  }))
})

usePageSeo({
  title: () => t('demos.hero.title'),
  description: () => t('demos.hero.description'),
  canonicalPath: '/demos',
  keywords: () => tm('demos.meta.keywords') as string[],
  structuredData: () => ({
    '@type': 'CollectionPage',
    name: t('demos.hero.title'),
    url: buildCanonicalUrl('/demos'),
    description: t('demos.hero.description'),
  }),
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-16">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-12 sm:px-10">
      <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
      <div class="relative space-y-6">
        <span class="eyebrow">{{ t('demos.hero.eyebrow') }}</span>
        <h1 class="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
          {{ t('demos.hero.title') }}
        </h1>
        <p class="max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {{ t('demos.hero.description') }}
        </p>
      </div>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
      <RouterLink
        v-for="card in cards"
        :key="card.to"
        :to="card.to"
        class="group relative flex h-full flex-col gap-6 overflow-hidden rounded-[28px] border border-slate-800/60 bg-slate-950/70 p-6 transition hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900/70"
      >
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 transition group-hover:opacity-100" />
        <div class="relative space-y-3">
          <h2 class="text-lg font-semibold text-slate-100">
            {{ card.title }}
          </h2>
          <p class="text-xs leading-relaxed text-slate-400">
            {{ card.description }}
          </p>
        </div>
        <div class="relative flex flex-wrap gap-2">
          <span
            v-for="tag in card.tags || []"
            :key="tag"
            class="rounded-full border border-slate-700/60 bg-slate-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-400"
          >
            {{ tag }}
          </span>
        </div>
        <span class="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 transition group-hover:text-slate-100">
          {{ t('app.actions.viewDemo') }}
          <span aria-hidden="true" class="transition group-hover:translate-x-1">→</span>
        </span>
      </RouterLink>
    </section>
  </div>
</template>
