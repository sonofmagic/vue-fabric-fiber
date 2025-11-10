<script setup lang="ts">
import type { Canvas, Shadow } from 'fabric'
import type { FabricCircleModelValue, FabricImageModelValue, FabricRectModelValue, FabricTextModelValue } from '~/index'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { buildCanonicalUrl, SITE_NAME, usePageSeo } from '@/seo'
import { bindCanvasDragBounds } from '@/utils/canvasBounds'
import { FabricCanvas, FabricCircle, FabricImage, FabricRect, FabricText, RenderGroup } from '~/index'

import { demoCards } from './demos/cards'

const { t, tm, locale } = useI18n()

const HERO_CANVAS_DIMENSIONS = {
  width: 720,
  height: 520,
} as const

const heroCanvasStyle = {
  aspectRatio: `${HERO_CANVAS_DIMENSIONS.width} / ${HERO_CANVAS_DIMENSIONS.height}`,
  minHeight: `${HERO_CANVAS_DIMENSIONS.height}px`,
  width: '100%',
} as const

const detachHeroCanvasBounds = ref<VoidFunction | null>(null)

function handleHeroCanvasReady(canvas: Canvas) {
  detachHeroCanvasBounds.value?.()
  detachHeroCanvasBounds.value = bindCanvasDragBounds(canvas)
}

onBeforeUnmount(() => {
  detachHeroCanvasBounds.value?.()
})

const featuredDefinitions = demoCards.slice(0, 4)
const featuredDemos = computed(() => {
  return featuredDefinitions.map(card => ({
    ...card,
    title: t(card.titleKey),
    description: t(card.descriptionKey),
  }))
})

const heroHighlights = computed(() => tm('home.hero.highlights') as { title: string, description: string }[])
const heroStats = computed(() => tm('home.hero.stats') as { label: string, value: string }[])

const heroTitleShadow = {
  color: 'rgba(15,23,42,0.65)',
  blur: 14,
  offsetX: 2,
  offsetY: 2,
} as Shadow

const portraitShadow = {
  color: 'rgba(2,6,23,0.55)',
  blur: 18,
  offsetX: 0,
  offsetY: 16,
} as Shadow

function getHeadlineTexts(): string[] {
  const values = tm('home.hero.canvasCopy.headline')
  return Array.isArray(values) ? values.map(value => String(value)) : []
}

const initialHeadlines = getHeadlineTexts()

const textArray = ref<Omit<FabricTextModelValue, 'clipPath' | 'canvas' | 'path'>[]>([
  {
    text: initialHeadlines[0] ?? '',
    left: 66,
    top: 120,
    fontSize: 64,
    fill: '#f8fafc',
    fontFamily: 'Inter',
    fontWeight: '700',
    shadow: heroTitleShadow,
  },
  {
    text: initialHeadlines[1] ?? '',
    left: 70,
    top: 205,
    fontSize: 30,
    fill: '#cbd5f5',
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  {
    text: initialHeadlines[2] ?? '',
    left: 70,
    top: 265,
    fontSize: 22,
    fill: '#38bdf8',
    fontFamily: 'Inter',
    fontWeight: '600',
  },
])

const renderGroupTitle = ref<FabricTextModelValue>({
  text: t('home.hero.canvasCopy.queueTitle'),
  left: 420,
  top: 360,
  fontSize: 30,
  fill: '#fbbf24',
  fontFamily: 'Inter',
  fontWeight: '600',
  selectable: false,
})

const renderGroupGreeting = ref<FabricTextModelValue>({
  text: t('home.hero.canvasCopy.queueStatus'),
  left: 430,
  top: 410,
  fontSize: 28,
  fill: '#f8fafc',
  fontFamily: 'Inter',
  fontWeight: '500',
})

const heroCanvasImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  width: HERO_CANVAS_DIMENSIONS.width,
  height: HERO_CANVAS_DIMENSIONS.height,
  selectable: false,
  hasControls: false,
})

const accentPortraitImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80',
  width: 220,
  left: 420,
  top: 150,
  angle: -4,
  selectable: true,
  hasControls: true,
  shadow: portraitShadow,
})

const layoutPanels = ref<FabricRectModelValue[]>([
  {
    left: 360,
    top: 70,
    width: 220,
    height: 130,
    rx: 32,
    ry: 32,
    fill: 'rgba(15,23,42,0.78)',
    stroke: '#38bdf8',
    strokeWidth: 2,
    opacity: 0.9,
    selectable: false,
  },
  {
    left: 520,
    top: 240,
    width: 160,
    height: 120,
    rx: 28,
    ry: 28,
    fill: 'rgba(2,132,199,0.22)',
    stroke: '#22d3ee',
    strokeWidth: 1.5,
    opacity: 0.85,
    selectable: false,
  },
  {
    left: 360,
    top: 230,
    width: 110,
    height: 180,
    rx: 26,
    ry: 26,
    fill: 'rgba(76,29,149,0.18)',
    stroke: '#a855f7',
    strokeDashArray: [8, 6],
    strokeWidth: 1.5,
    opacity: 0.75,
    selectable: false,
  },
])

const haloCircle = ref<FabricCircleModelValue>({
  left: 500,
  top: 280,
  radius: 130,
  fill: 'rgba(6,182,212,0.18)',
  stroke: '#22d3ee',
  strokeWidth: 2,
  strokeDashArray: [10, 6],
  selectable: false,
})

const inspectorLayers = computed(() => {
  const layers = [
    {
      id: 'hero-image',
      label: t('home.hero.layerLabels.heroImage'),
      type: t('home.hero.layerTypes.image'),
      summary: heroCanvasImage.value.src?.split('?')[0] ?? t('home.hero.layerSummaries.heroFallback'),
    },
    {
      id: 'accent-portrait',
      label: t('home.hero.layerLabels.accentPortrait'),
      type: t('home.hero.layerTypes.image'),
      summary: accentPortraitImage.value.src?.split('?')[0] ?? t('home.hero.layerSummaries.accentFallback'),
    },
    {
      id: 'render-group-title',
      label: t('home.hero.layerLabels.renderGroupTitle'),
      type: t('home.hero.layerTypes.text'),
      summary: renderGroupTitle.value.text,
    },
    {
      id: 'render-group-greeting',
      label: t('home.hero.layerLabels.renderGroupGreeting'),
      type: t('home.hero.layerTypes.text'),
      summary: renderGroupGreeting.value.text,
    },
  ]

  layoutPanels.value.forEach((panel, index) => {
    layers.push({
      id: `panel-${index}`,
      label: t('home.hero.layerLabels.glowTile', { index: index + 1 }),
      type: t('home.hero.layerTypes.rect'),
      summary: t('home.hero.layerSummaries.glowTile', {
        width: `${panel.width ?? 0}×${panel.height ?? 0}px`,
        left: panel.left ?? 0,
        top: panel.top ?? 0,
      }),
    })
  })

  layers.push({
    id: 'halo-circle',
    label: t('home.hero.layerLabels.halo'),
    type: t('home.hero.layerTypes.circle'),
    summary: t('home.hero.layerSummaries.halo', { radius: haloCircle.value.radius ?? 0 }),
  })

  textArray.value.forEach((entry, index) => {
    layers.push({
      id: `copy-${index}`,
      label: t('home.hero.layerLabels.copyLayer', { index: index + 1 }),
      type: t('home.hero.layerTypes.text'),
      summary: entry.text,
    })
  })

  return layers
})

const selectedTextIndex = ref(0)
const activeTextLayer = computed(() => {
  return textArray.value[selectedTextIndex.value] ?? textArray.value[0] ?? null
})

const textLayerOptions = computed(() => {
  return textArray.value.map((layer, index) => {
    return {
      label: t('home.hero.layerLabels.copyLayer', { index: index + 1 }),
      value: index,
      preview: layer.text,
    }
  })
})

const isInteractiveMode = ref(false)

const interactiveToggleLabel = computed(() => {
  return isInteractiveMode.value ? t('app.actions.exitInteractive') : t('app.actions.enterInteractive')
})

function toggleInteractiveMode() {
  isInteractiveMode.value = !isInteractiveMode.value
}

function closeInteractiveMode() {
  isInteractiveMode.value = false
}

watch(locale, () => {
  const updatedHeadlines = getHeadlineTexts()
  textArray.value.forEach((entry, index) => {
    entry.text = updatedHeadlines[index] ?? entry.text
  })
  renderGroupTitle.value.text = t('home.hero.canvasCopy.queueTitle')
  renderGroupGreeting.value.text = t('home.hero.canvasCopy.queueStatus')
})

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
              v-for="stat in heroStats"
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
              v-for="highlight in heroHighlights"
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
            <span>{{ inspectorLayers.length }}</span>
          </div>
          <div class="mt-4 grid max-h-[320px] gap-3 overflow-auto pr-1 sm:grid-cols-2">
            <div
              v-for="layer in inspectorLayers"
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

    <section class="relative rounded-[32px] surface-panel p-6 sm:p-8">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-[32px] border border-slate-800/40">
        <div class="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-500/10" />
      </div>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="space-y-2">
          <span class="eyebrow">{{ t('home.hero.interactive.eyebrow') }}</span>
          <h2 class="text-2xl font-semibold text-slate-100">
            {{ t('home.hero.interactive.title') }}
          </h2>
          <p class="max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
            {{ t('home.hero.interactive.description') }}
          </p>
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200 transition hover:border-cyan-300 hover:text-white"
          type="button"
          @click="toggleInteractiveMode"
        >
          <span>{{ interactiveToggleLabel }}</span>
          <span
            class="h-2 w-2 rounded-full transition"
            :class="isInteractiveMode ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-500'"
          />
        </button>
      </div>

      <Teleport to="body" :disabled="!isInteractiveMode">
        <div
          class="relative w-full"
          :class="[
            isInteractiveMode
              ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-10 backdrop-blur-xl'
              : 'mt-6',
          ]"
          @click.self="closeInteractiveMode"
        >
          <button
            v-if="isInteractiveMode"
            class="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200 transition hover:border-slate-500 hover:text-white"
            type="button"
            @click.stop="closeInteractiveMode"
          >
            {{ t('app.actions.close') }}
            <span aria-hidden="true">×</span>
          </button>

          <div
            class="grid w-full gap-6"
            :class="[
              isInteractiveMode
                ? 'mx-auto max-w-6xl lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start'
                : 'grid-cols-1',
            ]"
          >
            <div
              class="canvas-shell relative overflow-hidden rounded-[28px] border border-slate-800/60 bg-slate-950/90 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.9)]"
              :style="heroCanvasStyle"
            >
              <FabricCanvas
                :canvas-options="{ width: HERO_CANVAS_DIMENSIONS.width, height: HERO_CANVAS_DIMENSIONS.height, preserveObjectStacking: true }"
                @ready="handleHeroCanvasReady"
              >
                <FabricImage v-model="heroCanvasImage" preset="background" />
                <FabricCircle v-model="haloCircle" />
                <template v-for="(_, idx) in layoutPanels" :key="`panel-${idx}`">
                  <FabricRect v-model="layoutPanels[idx]" />
                </template>
                <template v-for="(_, idx) in textArray" :key="idx">
                  <FabricText v-model="textArray[idx]" />
                </template>

                <RenderGroup>
                  <FabricText v-model="renderGroupTitle" />
                  <FabricImage v-model="accentPortraitImage" preset="overlay" />
                  <FabricText v-model="renderGroupGreeting" />
                </RenderGroup>
              </FabricCanvas>
            </div>

            <div
              class="flex flex-col gap-6 rounded-[28px] border border-slate-800/60 bg-slate-950/70 p-5 text-sm text-slate-100"
              :class="isInteractiveMode ? 'max-h-[520px] overflow-auto pr-3' : ''"
            >
              <div class="space-y-2">
                <span class="eyebrow">{{ t('home.hero.interactive.panel.title') }}</span>
                <p class="text-xs leading-relaxed text-slate-400">
                  {{ t('home.hero.interactive.panel.description') }}
                </p>
              </div>

              <div class="grid gap-6 lg:grid-cols-2">
                <section class="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
                  <div class="flex items-center justify-between text-xs uppercase tracking-[0.34em] text-slate-400">
                    <span>{{ t('home.hero.interactive.portrait.title') }}</span>
                    <span>{{ t('home.hero.interactive.portrait.type') }}</span>
                  </div>
                  <div class="mt-4 grid gap-3 sm:grid-cols-2">
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.portrait.fields.left') }}
                      <input
                        v-model.number="accentPortraitImage.left"
                        class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                        max="580"
                        min="0"
                        step="1"
                        type="number"
                      >
                    </label>
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.portrait.fields.top') }}
                      <input
                        v-model.number="accentPortraitImage.top"
                        class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                        max="360"
                        min="0"
                        step="1"
                        type="number"
                      >
                    </label>
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.portrait.fields.width') }}
                      <input
                        v-model.number="accentPortraitImage.width"
                        class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                        max="320"
                        min="120"
                        step="5"
                        type="number"
                      >
                    </label>
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.portrait.fields.angle') }}
                      <input
                        v-model.number="accentPortraitImage.angle"
                        class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                        max="20"
                        min="-20"
                        step="1"
                        type="number"
                      >
                    </label>
                  </div>
                </section>

                <section class="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
                  <div class="flex items-center justify-between text-xs uppercase tracking-[0.34em] text-slate-400">
                    <span>{{ t('home.hero.interactive.headline.title') }}</span>
                    <span>{{ t('home.hero.interactive.headline.type') }}</span>
                  </div>
                  <div class="mt-4 space-y-3">
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.headline.fields.selectLabel') }}
                      <select
                        v-model.number="selectedTextIndex"
                        class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                      >
                        <option
                          v-for="option in textLayerOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </label>
                    <template v-if="activeTextLayer">
                      <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                        {{ t('home.hero.interactive.headline.fields.copy') }}
                        <textarea
                          v-model="activeTextLayer.text"
                          class="min-h-[64px] rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                        />
                      </label>
                      <div class="grid gap-3 sm:grid-cols-2">
                        <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                          {{ t('home.hero.interactive.headline.fields.fontSize') }}
                          <input
                            v-model.number="activeTextLayer.fontSize"
                            class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                            max="96"
                            min="16"
                            step="1"
                            type="number"
                          >
                        </label>
                        <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                          {{ t('home.hero.interactive.headline.fields.color') }}
                          <input
                            v-model="activeTextLayer.fill"
                            class="h-10 rounded-xl border border-slate-800/60 bg-slate-900/60 px-2 py-2 text-sm text-slate-100"
                            type="color"
                          >
                        </label>
                      </div>
                      <div class="grid gap-3 sm:grid-cols-2">
                        <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                          {{ t('home.hero.interactive.headline.fields.left') }}
                          <input
                            v-model.number="activeTextLayer.left"
                            class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                            max="640"
                            min="0"
                            step="1"
                            type="number"
                          >
                        </label>
                        <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                          {{ t('home.hero.interactive.headline.fields.top') }}
                          <input
                            v-model.number="activeTextLayer.top"
                            class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                            max="420"
                            min="0"
                            step="1"
                            type="number"
                          >
                        </label>
                      </div>
                    </template>
                    <p v-else class="text-xs text-slate-500">
                      {{ t('home.hero.interactive.headline.empty') }}
                    </p>
                  </div>
                </section>
              </div>

              <div class="grid gap-6 lg:grid-cols-2">
                <section class="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
                  <div class="flex items-center justify-between text-xs uppercase tracking-[0.34em] text-slate-400">
                    <span>{{ t('home.hero.interactive.tiles.title') }}</span>
                    <span>{{ t('home.hero.interactive.tiles.type') }}</span>
                  </div>
                  <div class="mt-4 grid gap-3 md:grid-cols-3">
                    <div
                      v-for="(panel, idx) in layoutPanels"
                      :key="`panel-controls-${idx}`"
                      class="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3 text-xs text-slate-300"
                    >
                      <p class="text-[11px] uppercase tracking-[0.32em] text-slate-500">
                        {{ t('home.hero.interactive.tiles.cardLabel', { index: idx + 1 }) }}
                      </p>
                      <label class="mt-2 flex flex-col gap-1">
                        <span>{{ t('home.hero.interactive.tiles.fields.width') }}</span>
                        <input
                          v-model.number="panel.width"
                          class="rounded-lg border border-slate-800/60 bg-slate-950/60 px-2 py-1.5 text-sm text-slate-100"
                          max="280"
                          min="80"
                          step="2"
                          type="number"
                        >
                      </label>
                      <label class="mt-2 flex flex-col gap-1">
                        <span>{{ t('home.hero.interactive.tiles.fields.height') }}</span>
                        <input
                          v-model.number="panel.height"
                          class="rounded-lg border border-slate-800/60 bg-slate-950/60 px-2 py-1.5 text-sm text-slate-100"
                          max="220"
                          min="80"
                          step="2"
                          type="number"
                        >
                      </label>
                      <label class="mt-2 flex flex-col gap-1">
                        <span>{{ t('home.hero.interactive.tiles.fields.opacity') }}</span>
                        <input
                          v-model.number="panel.opacity"
                          class="rounded-lg border border-slate-800/60 bg-slate-950/60 px-2 py-1.5 text-sm text-slate-100"
                          max="1"
                          min="0.2"
                          step="0.05"
                          type="number"
                        >
                      </label>
                    </div>
                  </div>
                </section>

                <section class="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4">
                  <div class="flex items-center justify-between text-xs uppercase tracking-[0.34em] text-slate-400">
                    <span>{{ t('home.hero.interactive.halo.title') }}</span>
                    <span>{{ t('home.hero.interactive.halo.type') }}</span>
                  </div>
                  <div class="mt-4 space-y-4">
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.halo.fields.radius') }}
                      <input
                        v-model.number="haloCircle.radius"
                        class="accent-cyan-300"
                        max="240"
                        min="80"
                        step="1"
                        type="range"
                      >
                    </label>
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.halo.fields.queueTitle') }}
                      <input
                        v-model="renderGroupTitle.text"
                        class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                        type="text"
                      >
                    </label>
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.halo.fields.titleColor') }}
                      <input
                        v-model="renderGroupTitle.fill"
                        class="h-10 rounded-xl border border-slate-800/60 bg-slate-900/60 px-2 py-2 text-sm text-slate-100"
                        type="color"
                      >
                    </label>
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.halo.fields.queueStatus') }}
                      <input
                        v-model="renderGroupGreeting.text"
                        class="rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
                        type="text"
                      >
                    </label>
                    <label class="flex flex-col gap-2 text-[11px] uppercase tracking-[0.32em] text-slate-500">
                      {{ t('home.hero.interactive.halo.fields.statusColor') }}
                      <input
                        v-model="renderGroupGreeting.fill"
                        class="h-10 rounded-xl border border-slate-800/60 bg-slate-900/60 px-2 py-2 text-sm text-slate-100"
                        type="color"
                      >
                    </label>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <section class="space-y-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span class="eyebrow">{{ t('home.hero.featured.eyebrow') }}</span>
            <h2 class="mt-3 text-2xl font-semibold text-slate-100">
              {{ t('home.hero.featured.title') }}
            </h2>
          </div>
          <div class="flex flex-col gap-3 text-xs leading-relaxed text-slate-400 sm:text-sm">
            <p class="max-w-xl">
              {{ t('home.hero.featured.description') }}
            </p>
            <RouterLink
              class="group inline-flex w-fit items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-slate-600 hover:text-slate-100"
              to="/demos"
            >
              {{ t('app.actions.viewAllDemos') }}
              <span aria-hidden="true" class="transition group-hover:translate-x-0.5">→</span>
            </RouterLink>
          </div>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <RouterLink
            v-for="route in featuredDemos"
            :key="route.to"
            :to="route.to"
            class="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-slate-800/60 bg-slate-950/70 p-6 transition hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900/70"
          >
            <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 transition group-hover:opacity-100" />
            <div class="relative space-y-3">
              <h3 class="text-lg font-medium text-slate-100">
                {{ route.title }}
              </h3>
              <p class="text-xs leading-relaxed text-slate-400">
                {{ route.description }}
              </p>
            </div>
            <span class="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 transition group-hover:text-slate-100">
              {{ t('app.actions.viewDemo') }}
              <span aria-hidden="true" class="transition group-hover:translate-x-1">→</span>
            </span>
          </RouterLink>
        </div>
      </section>
    </section>
  </div>
</template>
