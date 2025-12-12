<script setup lang="ts">
import type { WatermarkAxis, WatermarkField } from './types'
import { PAGE_HEIGHT, PAGE_WIDTH } from './constants'

const props = defineProps<{
  resolveColorDisplay: (value: unknown) => string
  onColorEdited: () => void
  xMax: number
  bottomMax: number
}>()

const field = defineModel<WatermarkField>({ required: true })

const clampNumber = (value: number) => (Number.isFinite(value) ? value : 0)

function syncAxisFromPx(axis: WatermarkAxis, total: number) {
  axis.px = Math.max(0, Math.round(clampNumber(axis.px)))
  axis.percent = Number(((axis.px / total) * 100).toFixed(2))
  axis.unit = 'px'
}

function syncAxisFromPercent(axis: WatermarkAxis, total: number) {
  axis.percent = Math.max(0, clampNumber(axis.percent))
  axis.px = Math.round((axis.percent / 100) * total)
  axis.unit = '%'
}
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
          v-model.number="field.x.px"
          class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)"
          type="number"
          min="0"
          :max="props.xMax"
          step="1"
          @input="syncAxisFromPx(field.x, PAGE_WIDTH)"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span class="whitespace-nowrap">X (%)</span>
        <input
          v-model.number="field.x.percent"
          class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)"
          type="number"
          min="0"
          max="100"
          step="0.25"
          @input="syncAxisFromPercent(field.x, PAGE_WIDTH)"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span class="whitespace-nowrap">Y (px，自底部)</span>
        <input
          v-model.number="field.bottom.px"
          class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)"
          type="number"
          min="0"
          :max="props.bottomMax"
          step="1"
          @input="syncAxisFromPx(field.bottom, PAGE_HEIGHT)"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span class="whitespace-nowrap">Y (%)</span>
        <input
          v-model.number="field.bottom.percent"
          class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)"
          type="number"
          min="0"
          max="100"
          step="0.25"
          @input="syncAxisFromPercent(field.bottom, PAGE_HEIGHT)"
        >
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-(--fp-text-dim)">
        <span>字号</span>
        <input v-model.number="field.fontSize" class="w-full rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2.5 text-sm text-(--fp-text-primary)" type="number" min="8" max="32" step="1">
      </label>
    </div>
    <p class="mt-1 text-[11px] text-(--fp-text-muted)">
      当前单位：X={{ field.x.unit }} · Y={{ field.bottom.unit }}
    </p>
  </div>
</template>
