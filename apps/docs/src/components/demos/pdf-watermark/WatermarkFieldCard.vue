<script setup lang="ts">
import type { WatermarkField } from './types'

const props = defineProps<{
  resolveColorDisplay: (value: unknown) => string
  onColorEdited: () => void
  xMax: number
  bottomMax: number
}>()

const field = defineModel<WatermarkField>({ required: true })
</script>

<template>
  <div class="rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg-soft) p-2 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.55)]">
    <p class="text-[11px] font-semibold text-(--fp-text-primary)">
      水印点：{{ field.label }}
    </p>
    <div class="mt-2 grid gap-1.5 sm:grid-cols-2">
      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-(--fp-text-dim) sm:col-span-2">
        <span>内容</span>
        <input v-model="field.text" class="w-full rounded-lg border border-(--fp-border-color) bg-(--fp-panel-bg) px-2 py-1.5 text-[12px] text-(--fp-text-primary)" type="text" placeholder="输入水印文本">
      </label>
      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-(--fp-text-dim)">
        <span>颜色</span>
        <div class="grid grid-cols-[1fr_auto] items-center gap-1.5">
          <input
            v-model="field.color"
            class="min-h-[2rem] w-full rounded-lg border border-(--fp-border-color) bg-(--fp-panel-bg) px-2 py-1.5"
            type="color"
            @input="props.onColorEdited()"
          >
          <span class="inline-flex items-center rounded-md border border-(--fp-border-color) bg-(--fp-panel-bg-soft) px-1.5 py-0.5 text-[10px] font-medium text-(--fp-text-muted)">
            {{ props.resolveColorDisplay(field.color) }}
          </span>
        </div>
      </label>
      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-(--fp-text-dim)">
        <span>透明度</span>
        <input v-model.number="field.opacity" class="w-full rounded-lg border border-(--fp-border-color) bg-(--fp-panel-bg) px-2 py-1.5 text-[12px] text-(--fp-text-primary)" type="number" min="0" max="1" step="0.05">
      </label>
    </div>
    <div class="mt-2 grid gap-1.5 sm:grid-cols-4">
      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-(--fp-text-dim)">
        <span>X</span>
        <input v-model.number="field.x" class="w-full rounded-lg border border-(--fp-border-color) bg-(--fp-panel-bg) px-2 py-1.5 text-[12px] text-(--fp-text-primary)" type="number" min="0" :max="props.xMax" step="1">
      </label>
      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-(--fp-text-dim)">
        <span>Y (自底部)</span>
        <input v-model.number="field.bottom" class="w-full rounded-lg border border-(--fp-border-color) bg-(--fp-panel-bg) px-2 py-1.5 text-[12px] text-(--fp-text-primary)" type="number" min="0" :max="props.bottomMax" step="1">
      </label>
      <label class="flex flex-col gap-1 text-[10px] uppercase tracking-[0.18em] text-(--fp-text-dim)">
        <span>字号</span>
        <input v-model.number="field.fontSize" class="w-full rounded-lg border border-(--fp-border-color) bg-(--fp-panel-bg) px-2 py-1.5 text-[12px] text-(--fp-text-primary)" type="number" min="8" max="32" step="1">
      </label>
    </div>
  </div>
</template>
