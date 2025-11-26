<script setup lang="ts">
import type { WatermarkField } from './types'
import StepCard from './StepCard.vue'
import WatermarkFieldCard from './WatermarkFieldCard.vue'

const props = defineProps<{
  pdfLoading: boolean
  pdfFileName: string
  pdfError: string | null
  pdfLoaded: boolean
  rotationLabel: string
  scaleLabel: string
  watermarkFields: WatermarkField[]
  watermarkXMax: number
  watermarkBottomMax: number
  resolveColorDisplay: (value: unknown) => string
  exporting: boolean
  exportError: string | null
  onFileChange: (event: Event) => void
  onResetPdf: () => void
  onRotate: (direction: 'cw' | 'ccw') => void
  onExport: () => void
  onColorEdited: (id: WatermarkField['id']) => void
  onUpdateField: (index: number, value: WatermarkField) => void
}>()
</script>

<template>
  <section class="rounded-[28px] border border-(--fp-border-color) bg-(--fp-panel-bg) p-4 sm:p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
    <div class="space-y-2">
      <span class="text-[11px] uppercase tracking-[0.28em] text-(--fp-text-dim)">配置</span>
      <p class="text-sm text-(--fp-text-muted)">
        上传 PDF 后，可以拖拽、旋转、等比例缩放；两个 FabricText 固定在页面左下角并排展示。
      </p>
    </div>

    <div class="mt-6 space-y-5 text-[13px] text-(--fp-text-primary)">
      <StepCard :index="1" title="上传原始文件" desc="仅支持上传 PDF 文件，未导入时画布保持空白占位。">
        <div class="flex flex-wrap items-center gap-3">
          <label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg-soft) px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-(--fp-text-primary) transition hover:-translate-y-0.5 hover:border-(--fp-border-color-strong) hover:bg-(--fp-panel-bg)">
            <input accept="application/pdf" class="sr-only" type="file" @change="props.onFileChange">
            <span>{{ props.pdfLoading ? '正在导入…' : '上传 PDF' }}</span>
          </label>
          <span class="text-xs text-(--fp-text-muted)">{{ props.pdfFileName }}</span>
          <button class="text-xs text-(--fp-text-muted) underline-offset-2 transition hover:text-(--fp-text-primary)" type="button" @click="props.onResetPdf">
            清空
          </button>
        </div>
        <p v-if="props.pdfError" class="text-xs text-red-300">
          {{ props.pdfError }}
        </p>
      </StepCard>

      <StepCard :index="2" title="手动裁剪" desc="拖拽 PDF 图层移动，拖四角控制点等比例缩放。">
        <div class="rounded-2xl border border-(--fp-border-color) bg-(--fp-panel-bg-soft) p-3">
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-[11px] uppercase tracking-[0.28em] text-(--fp-text-dim)">旋转</span>
            <button
              class="inline-flex items-center gap-1 rounded-lg border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2 text-xs font-semibold text-(--fp-text-primary) transition hover:border-(--fp-border-color-strong) disabled:cursor-not-allowed disabled:text-(--fp-text-dim) disabled:hover:border-(--fp-border-color)"
              type="button"
              :disabled="!props.pdfLoaded"
              @click="props.onRotate('ccw')"
            >
              ↺ 逆时针 90°
            </button>
            <button
              class="inline-flex items-center gap-1 rounded-lg border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-2 text-xs font-semibold text-(--fp-text-primary) transition hover:border-(--fp-border-color-strong) disabled:cursor-not-allowed disabled:text-(--fp-text-dim) disabled:hover:border-(--fp-border-color)"
              type="button"
              :disabled="!props.pdfLoaded"
              @click="props.onRotate('cw')"
            >
              ↻ 顺时针 90°
            </button>
            <span class="text-xs text-(--fp-text-muted)">当前角度：{{ props.rotationLabel }} · 缩放：{{ props.scaleLabel }}</span>
          </div>
          <div class="mt-3 grid gap-2 rounded-xl border border-(--fp-border-color) bg-(--fp-panel-bg) p-3 text-xs text-(--fp-text-muted)">
            <div class="flex gap-3 rounded-lg bg-(--fp-panel-bg-soft) px-3 py-2">
              <span class="min-w-[52px] text-(--fp-text-primary)">旋转</span>
              <span>点击上方图标，单次旋转 90°。</span>
            </div>
            <div class="flex gap-3 rounded-lg bg-(--fp-panel-bg-soft) px-3 py-2">
              <span class="min-w-[52px] text-(--fp-text-primary)">移动</span>
              <span>鼠标指向 PDF 变成手型时拖动，可移动裁剪区域。</span>
            </div>
            <div class="flex gap-3 rounded-lg bg-(--fp-panel-bg-soft) px-3 py-2">
              <span class="min-w-[52px] text-(--fp-text-primary)">缩放</span>
              <span>拖动四角圆点可实现等比例缩放。</span>
            </div>
          </div>
        </div>
      </StepCard>

      <StepCard :index="3" title="打水印" desc="X 为左侧偏移，Y 以底部为基准；文本始终贴在页面左下角并排展示。">
        <div class="grid gap-4">
          <WatermarkFieldCard
            v-for="(field, index) in props.watermarkFields"
            :key="field.id"
            :model-value="field"
            :resolve-color-display="props.resolveColorDisplay"
            :x-max="props.watermarkXMax"
            :bottom-max="props.watermarkBottomMax"
            :on-color-edited="() => props.onColorEdited(field.id)"
            @update:model-value="(value: WatermarkField) => props.onUpdateField(index, value)"
          />
        </div>
      </StepCard>

      <StepCard :index="4" title="确认裁剪" desc="点击确认后，可按当前位置导出或打印。">
        <div class="flex flex-wrap items-center gap-3">
          <button
            class="inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.26em] text-white transition hover:-translate-y-0.5 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
            type="button"
            :disabled="props.exporting"
            @click="props.onExport"
          >
            {{ props.exporting ? '导出中…' : '确认裁剪' }}
          </button>
          <span class="text-xs text-(--fp-text-muted)">文件最终尺寸 10×15CM</span>
        </div>
        <p v-if="props.exportError" class="text-xs text-red-500">
          {{ props.exportError }}
        </p>
      </StepCard>
    </div>
  </section>
</template>
