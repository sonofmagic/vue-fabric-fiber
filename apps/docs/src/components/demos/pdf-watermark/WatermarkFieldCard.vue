<script setup lang="ts">
import type { WatermarkField } from './types'
import { computed } from 'vue'
import { PAGE_HEIGHT, PAGE_WIDTH } from './constants'

const props = defineProps<{
  resolveColorDisplay: (value: unknown) => string
  onColorEdited: () => void
  xMax: number
  yMax: number
}>()

const field = defineModel<WatermarkField>({ required: true })

const clampNumber = (value: number) => (Number.isFinite(value) ? value : 0)
const percentFromPx = (px: number, total: number) => {
  const safeTotal = total || 1
  return Number(((px / safeTotal) * 100).toFixed(2))
}
const pxFromPercent = (percent: number, total: number) => {
  const safePercent = clampNumber(percent)
  return Math.round((safePercent / 100) * (total || 1))
}

const xPx = computed({
  get: () => field.value.x.px,
  set: (val: number) => {
    const px = Math.max(0, Math.round(clampNumber(val)))
    field.value.x.px = px
    field.value.x.percent = percentFromPx(px, PAGE_WIDTH)
    field.value.x.unit = 'px'
  },
})

const xPercent = computed({
  get: () => field.value.x.percent,
  set: (val: number) => {
    const percent = Math.max(0, clampNumber(val))
    field.value.x.percent = percent
    field.value.x.px = pxFromPercent(percent, PAGE_WIDTH)
    field.value.x.unit = '%'
  },
})

const yPx = computed({
  get: () => field.value.y.px,
  set: (val: number) => {
    const px = Math.max(0, Math.round(clampNumber(val)))
    field.value.y.px = px
    field.value.y.percent = percentFromPx(px, PAGE_HEIGHT)
    field.value.y.unit = 'px'
  },
})

const yPercent = computed({
  get: () => field.value.y.percent,
  set: (val: number) => {
    const percent = Math.max(0, clampNumber(val))
    field.value.y.percent = percent
    field.value.y.px = pxFromPercent(percent, PAGE_HEIGHT)
    field.value.y.unit = '%'
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
          min="0"
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
          min="0"
          max="100"
          step="0.25"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span class="whitespace-nowrap">Y (px)</span>
        <input
          v-model.number="yPx"
          class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)"
          type="number"
          min="0"
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
          min="0"
          max="100"
          step="0.25"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span>字号</span>
        <input v-model.number="field.fontSize" class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)" type="number" min="8" max="32" step="1">
      </label>
    </div>
    <p class="mt-1 text-[11px] text-(--fp-text-muted)">
      当前单位：X={{ field.x.unit }} · Y={{ field.y.unit }}
    </p>
  </div>
</template>
