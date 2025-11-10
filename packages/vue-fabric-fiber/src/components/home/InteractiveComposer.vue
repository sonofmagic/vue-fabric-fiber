<script setup lang="ts">
import type { HeroSceneState } from '@/composables/useHeroScene'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { FabricCanvas, FabricCircle, FabricImage, FabricRect, FabricText, RenderGroup } from '~/index'

interface InteractiveComposerProps {
  scene: HeroSceneState
}

const props = defineProps<InteractiveComposerProps>()

const { t } = useI18n()
const {
  heroCanvasDimensions,
  heroCanvasStyle,
  heroCanvasImage,
  accentPortraitImage,
  layoutPanels,
  haloCircle,
  textArray,
  renderGroupTitle,
  renderGroupGreeting,
  selectedTextIndex,
  activeTextLayer,
  textLayerOptions,
  handleHeroCanvasReady,
} = props.scene

const isInteractiveMode = ref(false)
const interactiveToggleLabel = computed(() =>
  isInteractiveMode.value ? t('app.actions.exitInteractive') : t('app.actions.enterInteractive'),
)

function toggleInteractiveMode() {
  isInteractiveMode.value = !isInteractiveMode.value
}

function closeInteractiveMode() {
  isInteractiveMode.value = false
}
</script>

<template>
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

    <div v-if="!isInteractiveMode" class="mt-6">
      <div
        class="canvas-shell relative overflow-hidden rounded-[28px] border border-slate-800/60 bg-slate-950/90 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.9)]"
        :style="heroCanvasStyle"
      >
        <FabricCanvas
          :canvas-options="{ width: heroCanvasDimensions.width, height: heroCanvasDimensions.height, preserveObjectStacking: true }"
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
    </div>

    <template v-else>
      <Teleport to="body">
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-10 backdrop-blur-xl"
          @click.self="closeInteractiveMode"
        >
          <button
            class="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-200 transition hover:border-slate-500 hover:text-white"
            type="button"
            @click.stop="closeInteractiveMode"
          >
            {{ t('app.actions.close') }}
            <span aria-hidden="true">×</span>
          </button>

          <div class="grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div
              class="canvas-shell relative overflow-hidden rounded-[28px] border border-slate-800/60 bg-slate-950/90 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.9)]"
              :style="heroCanvasStyle"
            >
              <FabricCanvas
                :canvas-options="{ width: heroCanvasDimensions.width, height: heroCanvasDimensions.height, preserveObjectStacking: true }"
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

            <div class="flex flex-col gap-4 rounded-[24px] border border-slate-800/70 bg-slate-950/85 p-4 text-[11px] text-slate-100 max-h-[560px] overflow-auto pr-3">
              <div class="space-y-1">
                <span class="eyebrow text-[10px]">{{ t('home.hero.interactive.panel.title') }}</span>
                <p class="text-[11px] leading-relaxed text-slate-400">
                  {{ t('home.hero.interactive.panel.description') }}
                </p>
              </div>

              <section class="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-3">
                <div class="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-slate-400">
                  <span>{{ t('home.hero.interactive.portrait.title') }}</span>
                  <span>{{ t('home.hero.interactive.portrait.type') }}</span>
                </div>
                <div class="mt-3 grid gap-2 sm:grid-cols-2">
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                    {{ t('home.hero.interactive.portrait.fields.left') }}
                    <input
                      v-model.number="accentPortraitImage.left"
                      class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                      max="580"
                      min="0"
                      step="1"
                      type="number"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                    {{ t('home.hero.interactive.portrait.fields.top') }}
                    <input
                      v-model.number="accentPortraitImage.top"
                      class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                      max="360"
                      min="0"
                      step="1"
                      type="number"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                    {{ t('home.hero.interactive.portrait.fields.width') }}
                    <input
                      v-model.number="accentPortraitImage.width"
                      class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                      max="320"
                      min="120"
                      step="5"
                      type="number"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                    {{ t('home.hero.interactive.portrait.fields.angle') }}
                    <input
                      v-model.number="accentPortraitImage.angle"
                      class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                      max="20"
                      min="-20"
                      step="1"
                      type="number"
                    >
                  </label>
                </div>
              </section>

              <section class="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-3">
                <div class="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-slate-400">
                  <span>{{ t('home.hero.interactive.headline.title') }}</span>
                  <span>{{ t('home.hero.interactive.headline.type') }}</span>
                </div>
                <div class="mt-3 space-y-2">
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                    {{ t('home.hero.interactive.headline.fields.selectLabel') }}
                    <select
                      v-model.number="selectedTextIndex"
                      class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
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
                    <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                      {{ t('home.hero.interactive.headline.fields.copy') }}
                      <textarea
                        v-model="activeTextLayer.text"
                        class="min-h-[52px] rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                      />
                    </label>
                    <div class="grid gap-2 sm:grid-cols-2">
                      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                        {{ t('home.hero.interactive.headline.fields.fontSize') }}
                        <input
                          v-model.number="activeTextLayer.fontSize"
                          class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                          max="96"
                          min="16"
                          step="1"
                          type="number"
                        >
                      </label>
                      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                        {{ t('home.hero.interactive.headline.fields.color') }}
                        <input
                          v-model="activeTextLayer.fill"
                          class="h-8 rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1 text-xs text-slate-100"
                          type="color"
                        >
                      </label>
                    </div>
                    <div class="grid gap-2 sm:grid-cols-2">
                      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                        {{ t('home.hero.interactive.headline.fields.left') }}
                        <input
                          v-model.number="activeTextLayer.left"
                          class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                          max="640"
                          min="0"
                          step="1"
                          type="number"
                        >
                      </label>
                      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                        {{ t('home.hero.interactive.headline.fields.top') }}
                        <input
                          v-model.number="activeTextLayer.top"
                          class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                          max="420"
                          min="0"
                          step="1"
                          type="number"
                        >
                      </label>
                    </div>
                  </template>
                  <p v-else class="text-[10px] text-slate-500">
                    {{ t('home.hero.interactive.headline.empty') }}
                  </p>
                </div>
              </section>

              <section class="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-3">
                <div class="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-slate-400">
                  <span>{{ t('home.hero.interactive.tiles.title') }}</span>
                  <span>{{ t('home.hero.interactive.tiles.type') }}</span>
                </div>
                <div class="mt-3 grid gap-2 md:grid-cols-3">
                  <div
                    v-for="(panel, idx) in layoutPanels"
                    :key="`panel-controls-${idx}`"
                    class="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3 text-[10px] text-slate-300"
                  >
                    <p class="text-[10px] uppercase tracking-[0.26em] text-slate-500">
                      {{ t('home.hero.interactive.tiles.cardLabel', { index: idx + 1 }) }}
                    </p>
                    <label class="mt-2 flex flex-col gap-1">
                      <span>{{ t('home.hero.interactive.tiles.fields.width') }}</span>
                      <input
                        v-model.number="panel.width"
                        class="rounded-lg border border-slate-800/60 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-100"
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
                        class="rounded-lg border border-slate-800/60 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-100"
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
                        class="rounded-lg border border-slate-800/60 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-100"
                        max="1"
                        min="0.2"
                        step="0.05"
                        type="number"
                      >
                    </label>
                  </div>
                </div>
              </section>

              <section class="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-3">
                <div class="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-slate-400">
                  <span>{{ t('home.hero.interactive.halo.title') }}</span>
                  <span>{{ t('home.hero.interactive.halo.type') }}</span>
                </div>
                <div class="mt-3 space-y-3">
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
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
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                    {{ t('home.hero.interactive.halo.fields.queueTitle') }}
                    <input
                      v-model="renderGroupTitle.text"
                      class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                      type="text"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                    {{ t('home.hero.interactive.halo.fields.titleColor') }}
                    <input
                      v-model="renderGroupTitle.fill"
                      class="h-8 rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1 text-xs text-slate-100"
                      type="color"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                    {{ t('home.hero.interactive.halo.fields.queueStatus') }}
                    <input
                      v-model="renderGroupGreeting.text"
                      class="rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-100"
                      type="text"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                    {{ t('home.hero.interactive.halo.fields.statusColor') }}
                    <input
                      v-model="renderGroupGreeting.fill"
                      class="h-8 rounded-lg border border-slate-800/60 bg-slate-900/60 px-2 py-1 text-xs text-slate-100"
                      type="color"
                    >
                  </label>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </section>
</template>
