<script setup lang="ts">
import type { HeroInspectorLayer } from '@/composables/useHeroScene'
import type { HomeHeroHighlight, HomeHeroStat } from '@/types/home'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

interface HeroShowcaseProps {
  heroStats: HomeHeroStat[]
  heroHighlights: HomeHeroHighlight[]
  inspectorLayers: HeroInspectorLayer[]
}

const props = defineProps<HeroShowcaseProps>()

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
            v-for="stat in props.heroStats"
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
            v-for="highlight in props.heroHighlights"
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

      <div class="mt-6 rounded-3xl border border-slate-800/60 bg-slate-950/50 p-4 shadow-inner shadow-slate-950/40">
        <div class="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-slate-400">
          <span>{{ t('home.hero.inspectorLabel') }}</span>
          <span>{{ props.inspectorLayers.length }}</span>
        </div>
        <div class="mt-4 grid max-h-[320px] gap-3 overflow-auto pr-1 sm:grid-cols-2">
          <div
            v-for="layer in props.inspectorLayers"
            :key="layer.id"
            class="rounded-2xl border border-slate-800/40 bg-slate-950/70 p-3"
          >
            <p class="text-sm font-semibold text-slate-100">
              {{ layer.label }}
            </p>
            <p class="text-[11px] uppercase tracking-[0.34em] text-slate-500">
              {{ layer.type }}
            </p>
            <p class="mt-2 line-clamp-2 text-xs text-slate-400">
              {{ layer.summary }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
