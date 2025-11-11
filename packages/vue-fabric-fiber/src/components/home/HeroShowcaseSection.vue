<script setup lang="ts">
import type { HomeHeroHighlight, HomeHeroStat } from '@/types/home'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

type ListSource<T> = T[] | { value: T[] }

interface HeroShowcaseProps {
  heroStats?: ListSource<HomeHeroStat>
  heroHighlights?: ListSource<HomeHeroHighlight>
}

const props = withDefaults(defineProps<HeroShowcaseProps>(), {
  heroStats: () => [],
  heroHighlights: () => [],
})

function normalizeList<T>(source?: ListSource<T>) {
  if (!source) {
    return [] as T[]
  }
  const list = Array.isArray(source) ? source : source.value
  return Array.isArray(list) ? list.filter(Boolean) : []
}

const safeStats = computed(() => normalizeList(props.heroStats))
const safeHighlights = computed(() => normalizeList(props.heroHighlights))

const { t } = useI18n()
</script>

<template>
  <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-12 sm:px-10 sm:py-14">
    <div aria-hidden="true" class="absolute -right-20 top-10 h-60 w-60 rounded-full bg-cyan-400/25 blur-[140px]" />
    <div aria-hidden="true" class="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-purple-500/20 blur-[160px]" />
    <div class="relative grid gap-10 lg:grid-cols-[1fr_0.9fr]">
      <div class="space-y-8">
        <span class="eyebrow">{{ t('home.hero.eyebrow') }}</span>
        <div class="space-y-4">
          <h1 class="text-3xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-4xl lg:text-5xl">
            {{ t('home.hero.title') }}
          </h1>
          <p class="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {{ t('home.hero.description') }}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <RouterLink
            class="inline-flex items-center gap-3 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-200"
            to="/demos/basic"
          >
            {{ t('app.actions.exploreHeroBuilder') }}
            <span aria-hidden="true">↗</span>
          </RouterLink>
          <RouterLink
            class="inline-flex items-center gap-3 rounded-full border border-slate-700/70 bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-slate-100"
            to="/demos/text-playground"
          >
            {{ t('app.actions.typographyCanvas') }}
          </RouterLink>
        </div>
        <dl class="grid gap-4 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="stat in safeStats"
            :key="stat.label"
            class="rounded-2xl border border-slate-800/60 bg-slate-900/55 px-4 py-5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.85)]"
          >
            <dt class="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              {{ stat.label }}
            </dt>
            <dd class="mt-2 text-lg font-semibold text-slate-100">
              {{ stat.value }}
            </dd>
          </div>
        </dl>
      </div>
      <div class="space-y-4 rounded-[28px] border border-slate-800/60 bg-slate-950/60 p-6 shadow-[0_30px_90px_-50px_rgba(8,47,73,0.85)] backdrop-blur-xl">
        <h2 class="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">
          {{ t('home.hero.highlightsTitle') }}
        </h2>
        <ul class="space-y-4 text-sm text-slate-300">
          <li
            v-for="highlight in safeHighlights"
            :key="highlight.title"
            class="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4"
          >
            <p class="text-sm font-medium text-slate-100">
              {{ highlight.title }}
            </p>
            <p class="mt-2 text-xs leading-relaxed text-slate-400">
              {{ highlight.description }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
