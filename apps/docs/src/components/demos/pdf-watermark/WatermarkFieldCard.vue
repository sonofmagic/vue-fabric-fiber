<script setup lang="ts">
import type { WatermarkField, WatermarkOrigin } from './types'
import { computed } from 'vue'
import { PAGE_HEIGHT, PAGE_WIDTH } from './constants'

const props = defineProps<{
  resolveColorDisplay: (value: unknown) => string
  onColorEdited: () => void
  xMax: number
  yMax: number
  origin: WatermarkOrigin
}>()

const field = defineModel<WatermarkField>({ required: true })

const clampNumber = (value: number) => (Number.isFinite(value) ? value : 0)
function toOriginPx(px: number, total: number, origin: WatermarkOrigin, axis: 'x' | 'y') {
  if ((origin === 'top-right' && axis === 'x') || (origin === 'bottom-right' && axis === 'x')) {
    return total - px
  }
  if ((origin === 'bottom-left' && axis === 'y') || (origin === 'bottom-right' && axis === 'y')) {
    return total - px
  }
  return px
}

function fromOriginPx(value: number, total: number, origin: WatermarkOrigin, axis: 'x' | 'y') {
  if ((origin === 'top-right' && axis === 'x') || (origin === 'bottom-right' && axis === 'x')) {
    return total - value
  }
  if ((origin === 'bottom-left' && axis === 'y') || (origin === 'bottom-right' && axis === 'y')) {
    return total - value
  }
  return value
}

const xPx = computed({
  get: () => toOriginPx(field.value.x.px, PAGE_WIDTH, props.origin, 'x'),
  set: (val: number) => {
    const pxFromOrigin = Math.round(clampNumber(val))
    const basePx = fromOriginPx(pxFromOrigin, PAGE_WIDTH, props.origin, 'x')
    field.value.x.px = basePx
    field.value.x.percent = clampNumber(field.value.x.percent)
  },
})

const xPercent = computed({
  get: () => {
    return field.value.x.percent
  },
  set: (val: number) => {
    const percent = clampNumber(val)
    const originPx = Math.round((percent / 100) * (PAGE_WIDTH || 1))
    const basePx = fromOriginPx(originPx, PAGE_WIDTH, props.origin, 'x')
    field.value.x.percent = percent
    field.value.x.px = basePx
  },
})

const yPx = computed({
  get: () => toOriginPx(field.value.y.px, PAGE_HEIGHT, props.origin, 'y'),
  set: (val: number) => {
    const pxFromOrigin = Math.round(clampNumber(val))
    const basePx = fromOriginPx(pxFromOrigin, PAGE_HEIGHT, props.origin, 'y')
    field.value.y.px = basePx
    field.value.y.percent = clampNumber(field.value.y.percent)
  },
})

const yPercent = computed({
  get: () => {
    return field.value.y.percent
  },
  set: (val: number) => {
    const percent = clampNumber(val)
    const originPx = Math.round((percent / 100) * (PAGE_HEIGHT || 1))
    const basePx = fromOriginPx(originPx, PAGE_HEIGHT, props.origin, 'y')
    field.value.y.percent = percent
    field.value.y.px = basePx
  },
})
</script>

<template>
  <div class="rounded-2xl border border-(--fp-border-color) bg-(--fp-panel-bg-soft) p-3 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.5)]">
    <p class="text-xs font-semibold text-(--fp-text-primary)">
      水印点：{{ field.label }}
    </p>
    <div class="mt-3 grid gap-3 sm:grid-cols-2">
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim) sm:col-span-2">
        <span>内容</span>
        <input v-model="field.text" class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)" type="text" placeholder="输入水印文本">
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span>颜色</span>
        <div class="grid grid-cols-[1fr_auto] items-center gap-2">
          <input
            v-model="field.color"
            class="min-h-[2.6rem] w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5"
            type="color"
            @input="props.onColorEdited()"
          >
          <span class="inline-flex items-center rounded-lg border border-(--fp-border-color) bg-(--fp-panel-bg-soft) px-2.5 py-1 text-xs font-medium text-(--fp-text-muted)">
            {{ props.resolveColorDisplay(field.color) }}
          </span>
        </div>
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span>透明度</span>
        <input v-model.number="field.opacity" class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)" type="number" min="0" max="1" step="0.05">
      </label>
    </div>
    <div class="mt-3 grid gap-3 sm:grid-cols-5">
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span class="whitespace-nowrap">X (px)</span>
        <input
          v-model.number="xPx"
          class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)"
          type="number"
          :max="props.xMax"
          step="1"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span class="whitespace-nowrap">X (%)</span>
        <input
          v-model.number="xPercent"
          class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)"
          type="number"
          step="0.25"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span class="whitespace-nowrap">Y (px)</span>
        <input
          v-model.number="yPx"
          class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)"
          type="number"
          :max="props.yMax"
          step="1"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span class="whitespace-nowrap">Y (%)</span>
        <input
          v-model.number="yPercent"
          class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)"
          type="number"
          step="0.25"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span>字号</span>
        <input v-model.number="field.fontSize" class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)" type="number" min="8" max="32" step="1">
      </label>
    </div>
  </div>
</template>
