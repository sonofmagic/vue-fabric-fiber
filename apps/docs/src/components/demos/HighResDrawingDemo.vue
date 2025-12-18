<script setup lang="ts">
import type { Canvas } from 'fabric'
import * as fabric from 'fabric'
import { computed, ref, watch } from 'vue'
import { FabricCanvas } from 'vue-fabric-fiber'

const canvasOptions = {
  width: 2480,
  height: 3508,
  backgroundColor: 'transparent',
  selection: false,
  freeDrawingCursor: 'crosshair',
} as const

const canvasRef = ref<Canvas | null>(null)
const currentTool = ref<'brush' | 'eraser'>('brush')
const brushColor = ref('#22d3ee')
const brushWidth = ref(12)
const eraserWidth = ref(32)
const exporting = ref(false)

const previewSizeLabel = computed(() => 'Preview: 620 × 877')
const resolutionLabel = computed(() => 'Output: 2480 × 3508')

function applyDrawingTool() {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  if (currentTool.value === 'brush') {
    const brush = new fabric.PencilBrush(canvas)
    brush.color = brushColor.value
    brush.width = brushWidth.value
    canvas.freeDrawingBrush = brush
  }
  else {
    const eraser = new fabric.EraserBrush(canvas)
    eraser.width = eraserWidth.value
    canvas.freeDrawingBrush = eraser
  }

  canvas.isDrawingMode = true
  canvas.renderAll()
}

function handleCanvasReady(canvas: Canvas) {
  canvasRef.value = canvas
  canvas.isDrawingMode = true
  canvas.backgroundColor = canvasOptions.backgroundColor
  canvas.renderAll()

  canvas.on('path:created', (event) => {
    if (event.path) {
      event.path.erasable = true
    }
  })

  applyDrawingTool()
}

function exportImage() {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }
  exporting.value = true
  try {
    const dataUrl = canvas.toDataURL({
      format: 'png',
      width: canvasOptions.width,
      height: canvasOptions.height,
      multiplier: 1,
    })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'high-res-drawing.png'
    link.click()
  }
  finally {
    exporting.value = false
  }
}

watch(currentTool, () => applyDrawingTool())
watch([brushColor, brushWidth], () => {
  if (currentTool.value === 'brush') {
    applyDrawingTool()
  }
})
watch(eraserWidth, () => {
  if (currentTool.value === 'eraser') {
    applyDrawingTool()
  }
})
</script>

<template>
  <section class="space-y-5">
    <div class="rounded-[28px] border border-panel bg-panel p-4 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.85)] sm:p-6">
      <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <p class="text-sm font-semibold text-primary">
            高分辨率画布绘制
          </p>
          <p class="text-xs text-muted">
            底层画布分辨率为 2480 × 3508，展示区域压缩到 620 × 877，适合导出高清 PNG。
          </p>
        </div>
        <div class="flex gap-2 text-[11px] uppercase tracking-[0.26em] text-muted">
          <span class="rounded-full border border-panel-soft bg-panel-soft px-3 py-1">
            {{ previewSizeLabel }}
          </span>
          <span class="rounded-full border border-panel-soft bg-panel-soft px-3 py-1">
            {{ resolutionLabel }}
          </span>
        </div>
      </header>

      <div class="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div class="space-y-3">
          <div class="relative rounded-[22px] border border-panel-soft bg-overlay-strong/60 p-3 high-res-canvas">
            <div class="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-1 text-[11px] uppercase tracking-[0.24em] text-muted">
              <span class="inline-flex items-center gap-1 rounded-full bg-panel/70 px-3 py-1 text-[10px] font-semibold text-secondary ring-1 ring-panel-soft">
                高清输出
              </span>
              <span class="rounded-full bg-panel/70 px-3 py-1 text-secondary ring-1 ring-panel-soft">
                {{ resolutionLabel }}
              </span>
              <span class="rounded-full bg-panel/70 px-3 py-1 text-secondary ring-1 ring-panel-soft">
                {{ previewSizeLabel }}
              </span>
            </div>
            <FabricCanvas
              class="h-full w-full"
              :canvas-options="canvasOptions"
              :display-width="620"
              :display-height="877"
              :auto-resize="false"
              :pixel-ratio="1"
              @ready="handleCanvasReady"
            />
          </div>
          <p class="text-[11px] leading-relaxed text-muted">
            使用 CSS 将 2480 × 3508 的画布缩放到 620 × 877 预览，绘制位置仍按照原始分辨率计算，导出时保持清晰度。
          </p>
        </div>

        <aside class="flex flex-col gap-4 rounded-[20px] border border-panel-soft bg-panel-soft p-4">
          <div class="space-y-1">
            <p class="text-sm font-semibold text-primary">
              工具栏
            </p>
            <p class="text-xs text-muted">
              切换画笔与橡皮，调整粗细，然后导出高清 PNG。
            </p>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              class="rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition"
              :class="currentTool === 'brush' ? 'border-cyan-400/80 bg-cyan-400/10 text-primary ring-1 ring-cyan-400/30' : 'border-panel text-muted hover:border-panel-strong'"
              type="button"
              @click="currentTool = 'brush'"
            >
              画笔
            </button>
            <button
              class="rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition"
              :class="currentTool === 'eraser' ? 'border-amber-400/80 bg-amber-400/10 text-primary ring-1 ring-amber-400/30' : 'border-panel text-muted hover:border-panel-strong'"
              type="button"
              @click="currentTool = 'eraser'"
            >
              橡皮
            </button>
          </div>

          <label class="flex flex-col gap-2 rounded-2xl border border-panel bg-panel px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-dim">
            画笔颜色
            <div class="flex items-center gap-3">
              <input
                v-model="brushColor"
                class="h-10 w-full rounded-xl border border-panel-soft bg-panel-soft"
                type="color"
              >
              <span class="rounded-full border border-panel-soft bg-panel-soft px-2 py-1 text-[11px] font-semibold text-secondary">
                {{ brushColor }}
              </span>
            </div>
          </label>

          <label class="flex flex-col gap-2 rounded-2xl border border-panel bg-panel px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-dim">
            画笔粗细
            <input
              v-model.number="brushWidth"
              class="accent-cyan-400"
              type="range"
              min="4"
              max="48"
            >
            <span class="text-xs text-secondary">
              {{ brushWidth }} px
            </span>
          </label>

          <label class="flex flex-col gap-2 rounded-2xl border border-panel bg-panel px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-dim">
            橡皮粗细
            <input
              v-model.number="eraserWidth"
              class="accent-amber-400"
              type="range"
              min="8"
              max="64"
            >
            <span class="text-xs text-secondary">
              {{ eraserWidth }} px
            </span>
          </label>

          <button
            class="inline-flex items-center justify-center gap-2 rounded-2xl border border-panel-strong bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-[0.26em] text-panel transition hover:-translate-y-[1px] hover:shadow-[0_20px_50px_-25px_rgba(14,165,233,0.8)]"
            type="button"
            :disabled="exporting"
            @click="exportImage"
          >
            <span>{{ exporting ? '导出中…' : '导出 PNG' }}</span>
          </button>

          <p class="text-[11px] leading-relaxed text-muted">
            导出文件会按照 2480 × 3508 的分辨率生成，即使预览区缩放到 620 × 877，线条也保持高清。
          </p>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.high-res-canvas :deep(canvas) {
  display: block;
  width: 620px;
  max-width: 100%;
  height: auto;
  aspect-ratio: 620 / 877;
  margin-inline: auto;
  border-radius: 18px;
}
</style>
