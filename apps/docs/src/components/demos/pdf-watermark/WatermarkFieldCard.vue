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
  <div class="rounded-2xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg-soft)] p-3 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.5)]">
    <p class="text-xs font-semibold text-[var(--fp-text-primary)]">
      水印点：{{ field.label }}
    </p>
    <div class="mt-3 grid gap-3 sm:grid-cols-2">
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-[var(--fp-text-dim)] sm:col-span-2">
        <span>内容</span>
        <input v-model="field.text" class="w-full rounded-xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] px-3 py-2.5 text-sm text-[var(--fp-text-primary)]" type="text" placeholder="输入水印文本">
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-[var(--fp-text-dim)]">
        <span>颜色</span>
        <div class="grid grid-cols-[1fr_auto] items-center gap-2">
          <input
            v-model="field.color"
            class="min-h-[2.6rem] w-full rounded-xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] px-3 py-2.5"
            type="color"
            @input="props.onColorEdited()"
          >
          <span class="inline-flex items-center rounded-lg border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg-soft)] px-2.5 py-1 text-xs font-medium text-[var(--fp-text-muted)]">
            {{ props.resolveColorDisplay(field.color) }}
          </span>
        </div>
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-[var(--fp-text-dim)]">
        <span>透明度</span>
        <input v-model.number="field.opacity" class="w-full rounded-xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] px-3 py-2.5 text-sm text-[var(--fp-text-primary)]" type="number" min="0" max="1" step="0.05">
      </label>
    </div>
    <div class="mt-3 grid gap-3 sm:grid-cols-4">
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-[var(--fp-text-dim)]">
        <span>X</span>
        <input v-model.number="field.x" class="w-full rounded-xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] px-3 py-2.5 text-sm text-[var(--fp-text-primary)]" type="number" min="0" :max="props.xMax" step="1">
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-[var(--fp-text-dim)]">
        <span>Y (自底部)</span>
        <input v-model.number="field.bottom" class="w-full rounded-xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] px-3 py-2.5 text-sm text-[var(--fp-text-primary)]" type="number" min="0" :max="props.bottomMax" step="1">
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-[var(--fp-text-dim)]">
        <span>字号</span>
        <input v-model.number="field.fontSize" class="w-full rounded-xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] px-3 py-2.5 text-sm text-[var(--fp-text-primary)]" type="number" min="8" max="32" step="1">
      </label>
    </div>
  </div>
</template>
