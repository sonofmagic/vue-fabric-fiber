<script setup lang="ts">
import type { Canvas } from 'fabric'
import type { FabricImageModelValue, FabricRectModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import type { WatermarkField } from './pdf-watermark/types'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import {
  FabricCanvas,
  FabricImage,

  FabricRect,

  FabricText,

  RenderGroup,
} from 'vue-fabric-fiber'
import StepCard from './pdf-watermark/StepCard.vue'
import WatermarkFieldCard from './pdf-watermark/WatermarkFieldCard.vue'

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = pdfjsWorker
}

const CANVAS_WIDTH = 540
const CANVAS_HEIGHT = 760
const PAGE_WIDTH = 360
const PAGE_HEIGHT = 540
const pageLeft = (CANVAS_WIDTH - PAGE_WIDTH) / 2
const pageTop = (CANVAS_HEIGHT - PAGE_HEIGHT) / 2
const pageBottom = pageTop + PAGE_HEIGHT

const canvasOptions = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  preserveObjectStacking: true,
  backgroundColor: 'transparent',
}

const pageMatte = ref<FabricRectModelValue>({
  left: pageLeft - 26,
  top: pageTop - 26,
  width: PAGE_WIDTH + 52,
  height: PAGE_HEIGHT + 52,
  rx: 16,
  ry: 16,
  fill: 'rgba(2,6,23,0.9)',
  stroke: 'rgba(100,116,139,0.45)',
  strokeWidth: 1,
  selectable: false,
  evented: false,
})

const pageOutline = ref<FabricRectModelValue>({
  left: pageLeft,
  top: pageTop,
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
  rx: 12,
  ry: 12,
  fill: 'rgba(148,163,184,0.05)',
  stroke: '#38bdf8',
  strokeWidth: 2,
  strokeDashArray: [10, 8],
  selectable: false,
  evented: false,
})

const placeholderLabel = ref<FabricTextModelValue>({
  text: '等待上传 PDF 文件',
  left: pageLeft + PAGE_WIDTH / 2,
  top: pageTop + PAGE_HEIGHT / 2,
  originX: 'center',
  originY: 'center',
  fontSize: 16,
  fontFamily: 'DM Sans',
  fontWeight: '600',
  fill: '#cbd5f5',
  opacity: 0.72,
  shadow: 'rgba(2,6,23,0.35) 0px 12px 32px',
  selectable: false,
  evented: false,
})

const pdfLayer = ref<FabricImageModelValue | null>(null)
const pdfFileName = ref('尚未上传')
const pdfLoading = ref(false)
const pdfError = ref<string | null>(null)
const exporting = ref(false)
const exportError = ref<string | null>(null)
const canvasRef = ref<Canvas | null>(null)
const themeMode = ref<'light' | 'dark'>('dark')
const watermarkColorEdited = reactive<Record<WatermarkField['id'], boolean>>({
  sku: false,
  order: false,
})
const syncingFromModel = ref(false)

const watermarkFields = reactive<WatermarkField[]>([
  {
    id: 'sku',
    label: '发货SKU Code或Repack',
    text: 'ItemCode',
    color: '#f8fafc',
    x: 12,
    bottom: 12,
    opacity: 0.92,
    fontSize: 12,
  },
  {
    id: 'order',
    label: '销售订单号（订单号过长时超出部分裁断）',
    text: 'Sales Order Number',
    color: '#f8fafc',
    x: 130,
    bottom: 12,
    opacity: 0.92,
    fontSize: 12,
  },
])

const watermarkSkuText = ref<FabricTextModelValue>({
  text: 'ItemCode',
  left: pageLeft + watermarkFields[0].x,
  top: pageBottom - watermarkFields[0].bottom,
  originX: 'left',
  originY: 'bottom',
  fontSize: watermarkFields[0].fontSize,
  fontFamily: 'Inter',
  fontWeight: '600',
  fill: watermarkFields[0].color,
  opacity: watermarkFields[0].opacity,
  selectable: true,
  evented: true,
  hasControls: false,
  hoverCursor: 'move',
  data: { watermarkId: 'sku' },
})

const watermarkOrderText = ref<FabricTextModelValue>({
  text: 'Sales Order Number',
  left: pageLeft + watermarkFields[1].x,
  top: pageBottom - watermarkFields[1].bottom,
  originX: 'left',
  originY: 'bottom',
  fontSize: watermarkFields[1].fontSize,
  fontFamily: 'Inter',
  fontWeight: '600',
  fill: watermarkFields[1].color,
  opacity: watermarkFields[1].opacity,
  selectable: true,
  evented: true,
  hasControls: false,
  hoverCursor: 'move',
  data: { watermarkId: 'order' },
})

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value : value == null ? '' : String(value)
}

function normalizeColor(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : '#f8fafc'
}

let colorProbe: HTMLDivElement | null = null

function resolveColorDisplay(value: unknown) {
  const normalized = normalizeColor(value)
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return normalized
  }

  if (!colorProbe) {
    colorProbe = document.createElement('div')
    colorProbe.style.position = 'absolute'
    colorProbe.style.visibility = 'hidden'
    colorProbe.style.pointerEvents = 'none'
    document.body.appendChild(colorProbe)
  }

  colorProbe.style.color = ''
  colorProbe.style.color = normalized
  const resolved = getComputedStyle(colorProbe).color
  return resolved || normalized
}

function markWatermarkColorEdited(id: WatermarkField['id']) {
  watermarkColorEdited[id] = true
}

function syncThemeMode() {
  if (typeof window === 'undefined') {
    return
  }
  const mode = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  themeMode.value = mode
}

let themeObserver: MutationObserver | null = null

onMounted(() => {
  syncThemeMode()
  themeObserver = new MutationObserver(syncThemeMode)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
})

watchEffect(() => {
  const isLight = themeMode.value === 'light'
  pageMatte.value.fill = isLight ? 'rgba(226,232,240,0.9)' : 'rgba(2,6,23,0.9)'
  pageMatte.value.stroke = isLight ? 'rgba(148,163,184,0.6)' : 'rgba(100,116,139,0.45)'
  pageOutline.value.fill = isLight ? 'rgba(15,23,42,0.05)' : 'rgba(148,163,184,0.05)'
  pageOutline.value.stroke = isLight ? '#0ea5e9' : '#38bdf8'
  placeholderLabel.value.fill = isLight ? '#475569' : '#cbd5f5'
  placeholderLabel.value.shadow = isLight ? 'rgba(15,23,42,0.22) 0px 10px 26px' : 'rgba(2,6,23,0.35) 0px 12px 32px'

  const defaultWatermarkColor = isLight ? '#0f172a' : '#f8fafc'
  if (!watermarkColorEdited.sku) {
    watermarkFields[0].color = defaultWatermarkColor
  }
  if (!watermarkColorEdited.order) {
    watermarkFields[1].color = defaultWatermarkColor
  }
})

const pdfLoaded = computed(() => Boolean(pdfLayer.value))
const rotationLabel = computed(() => {
  if (!pdfLayer.value) {
    return '0°'
  }
  const angle = pdfLayer.value.angle ?? 0
  return `${Math.round((angle + 360) % 360)}°`
})
const scaleLabel = computed(() => {
  if (!pdfLayer.value) {
    return '100%'
  }
  const scaleX = pdfLayer.value.scaleX ?? 1
  const scaleY = pdfLayer.value.scaleY ?? 1
  const uniform = Math.round(Math.min(scaleX, scaleY) * 100)
  return `${uniform}%`
})

function normalizeFileType(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

async function loadPdf(file: File) {
  pdfLoading.value = true
  pdfError.value = null
  pdfFileName.value = file.name
  try {
    if (!normalizeFileType(file)) {
      throw new Error('仅支持 PDF 文件')
    }

    const data = await file.arrayBuffer()
    const doc = await getDocument({ data }).promise
    const page = await doc.getPage(1)

    const viewport = page.getViewport({ scale: 2 })
    const renderCanvas = document.createElement('canvas')
    const context = renderCanvas.getContext('2d')

    if (!context) {
      throw new Error('无法创建 PDF 渲染上下文')
    }

    renderCanvas.width = viewport.width
    renderCanvas.height = viewport.height

    await page.render({
      canvasContext: context,
      viewport,
    }).promise

    const src = renderCanvas.toDataURL('image/png')

    const padding = 36
    const availableWidth = PAGE_WIDTH - padding
    const availableHeight = PAGE_HEIGHT - padding
    const fitScale = Math.min(availableWidth / viewport.width, availableHeight / viewport.height, 1)

    pdfLayer.value = {
      src,
      left: pageLeft + PAGE_WIDTH / 2,
      top: pageTop + PAGE_HEIGHT / 2,
      width: viewport.width * fitScale,
      height: viewport.height * fitScale,
      originX: 'center',
      originY: 'center',
      angle: 0,
      hoverCursor: 'move',
      centeredRotation: true,
      centeredScaling: true,
      lockScalingFlip: true,
      lockUniScaling: true,
      hasRotatingPoint: false,
      borderColor: '#38bdf8',
      cornerColor: '#e2e8f0',
      cornerStyle: 'circle',
      transparentCorners: false,
      padding: 4,
      strokeUniform: true,
    }
  }
  catch (error) {
    pdfError.value = error instanceof Error ? error.message : String(error)
    pdfLayer.value = null
  }
  finally {
    pdfLoading.value = false
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const [file] = target.files || []
  if (!file) {
    return
  }
  void loadPdf(file)
  target.value = ''
}

function rotatePdf(direction: 'cw' | 'ccw') {
  if (!pdfLayer.value) {
    return
  }
  const delta = direction === 'cw' ? 90 : -90
  const angle = pdfLayer.value.angle ?? 0
  const normalized = (angle + delta + 360) % 360
  pdfLayer.value.angle = normalized
}

function resetPdf() {
  pdfLayer.value = null
  pdfFileName.value = '尚未上传'
  pdfError.value = null
}

function handleCanvasReady(canvas: Canvas) {
  canvasRef.value = canvas
}

async function exportSnapshot() {
  if (!canvasRef.value) {
    exportError.value = '画布尚未初始化'
    return
  }
  exportError.value = null
  exporting.value = true
  try {
    const dataUrl = canvasRef.value.toDataURL({
      format: 'png',
      multiplier: 2,
      enableRetinaScaling: true,
    })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `pdf-crop-${Date.now()}.png`
    link.click()
  }
  catch (error) {
    exportError.value = error instanceof Error ? error.message : String(error)
  }
  finally {
    exporting.value = false
  }
}

function syncFieldToModel(field: WatermarkField, target: FabricTextModelValue) {
  target.left = pageLeft + field.x
  target.top = pageBottom - field.bottom
  target.opacity = field.opacity
  target.fontSize = field.fontSize
  target.text = normalizeText(field.text)
  target.fill = normalizeColor(field.color)
}

watch(
  () => ({
    x: watermarkFields[0].x,
    bottom: watermarkFields[0].bottom,
    opacity: watermarkFields[0].opacity,
    fontSize: watermarkFields[0].fontSize,
    text: watermarkFields[0].text,
    color: watermarkFields[0].color,
  }),
  () => {
    if (syncingFromModel.value) {
      return
    }
    syncFieldToModel(watermarkFields[0], watermarkSkuText.value)
  },
)

watch(
  () => ({
    x: watermarkFields[1].x,
    bottom: watermarkFields[1].bottom,
    opacity: watermarkFields[1].opacity,
    fontSize: watermarkFields[1].fontSize,
    text: watermarkFields[1].text,
    color: watermarkFields[1].color,
  }),
  () => {
    if (syncingFromModel.value) {
      return
    }
    syncFieldToModel(watermarkFields[1], watermarkOrderText.value)
  },
)

function syncModelToField(target: FabricTextModelValue, field: WatermarkField) {
  const rect = typeof (target as any)?.getBoundingRect === 'function'
    ? (target as any).getBoundingRect(true, true)
    : null
  const left = rect ? rect.left : target.left ?? pageLeft
  const bottomCoord = rect ? rect.top + (rect.height ?? 0) : target.top ?? pageBottom

  syncingFromModel.value = true
  field.x = Math.round(left - pageLeft)
  field.bottom = Math.round(pageBottom - bottomCoord)
  field.opacity = typeof target.opacity === 'number' ? target.opacity : field.opacity
  field.fontSize = typeof target.fontSize === 'number' ? target.fontSize : field.fontSize
  field.text = normalizeText(target.text)
  field.color = normalizeColor((target as any).fill ?? (target as any).stroke ?? field.color)
  syncingFromModel.value = false
}

watch(
  watermarkSkuText,
  (next) => {
    syncModelToField(next, watermarkFields[0])
  },
  { deep: true },
)

watch(
  watermarkOrderText,
  (next) => {
    syncModelToField(next, watermarkFields[1])
  },
  { deep: true },
)
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)]">
    <section class="rounded-[28px] border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] p-4 sm:p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
      <div class="space-y-2">
        <span class="text-[11px] uppercase tracking-[0.28em] text-[var(--fp-text-dim)]">配置</span>
        <p class="text-sm text-[var(--fp-text-muted)]">
          上传 PDF 后，可以拖拽、旋转、等比例缩放；两个 FabricText 固定在页面左下角并排展示。
        </p>
      </div>

      <div class="mt-6 space-y-5 text-[13px] text-[var(--fp-text-primary)]">
        <StepCard :index="1" title="上传原始文件" desc="仅支持上传 PDF 文件，未导入时画布保持空白占位。">
          <div class="flex flex-wrap items-center gap-3">
            <label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg-soft)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--fp-text-primary)] transition hover:-translate-y-0.5 hover:border-[var(--fp-border-color-strong)] hover:bg-[var(--fp-panel-bg)]">
              <input accept="application/pdf" class="sr-only" type="file" @change="handleFileChange">
              <span>{{ pdfLoading ? '正在导入…' : '上传 PDF' }}</span>
            </label>
            <span class="text-xs text-[var(--fp-text-muted)]">{{ pdfFileName }}</span>
            <button class="text-xs text-[var(--fp-text-muted)] underline-offset-2 transition hover:text-[var(--fp-text-primary)]" type="button" @click="resetPdf">
              清空
            </button>
          </div>
          <p v-if="pdfError" class="text-xs text-red-300">
            {{ pdfError }}
          </p>
        </StepCard>

        <StepCard :index="2" title="手动裁剪" desc="拖拽 PDF 图层移动，拖四角控制点等比例缩放。">
          <div class="rounded-2xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg-soft)] p-3">
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-[11px] uppercase tracking-[0.28em] text-[var(--fp-text-dim)]">旋转</span>
              <button
                class="inline-flex items-center gap-1 rounded-lg border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] px-3 py-2 text-xs font-semibold text-[var(--fp-text-primary)] transition hover:border-[var(--fp-border-color-strong)] disabled:cursor-not-allowed disabled:text-[var(--fp-text-dim)] disabled:hover:border-[var(--fp-border-color)]"
                type="button"
                :disabled="!pdfLoaded"
                @click="rotatePdf('ccw')"
              >
                ↺ 逆时针 90°
              </button>
              <button
                class="inline-flex items-center gap-1 rounded-lg border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] px-3 py-2 text-xs font-semibold text-[var(--fp-text-primary)] transition hover:border-[var(--fp-border-color-strong)] disabled:cursor-not-allowed disabled:text-[var(--fp-text-dim)] disabled:hover:border-[var(--fp-border-color)]"
                type="button"
                :disabled="!pdfLoaded"
                @click="rotatePdf('cw')"
              >
                ↻ 顺时针 90°
              </button>
              <span class="text-xs text-[var(--fp-text-muted)]">当前角度：{{ rotationLabel }} · 缩放：{{ scaleLabel }}</span>
            </div>
            <div class="mt-3 grid gap-2 rounded-xl border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] p-3 text-xs text-[var(--fp-text-muted)]">
              <div class="flex gap-3 rounded-lg bg-[var(--fp-panel-bg-soft)] px-3 py-2">
                <span class="min-w-[52px] text-[var(--fp-text-primary)]">旋转</span>
                <span>点击上方图标，单次旋转 90°。</span>
              </div>
              <div class="flex gap-3 rounded-lg bg-[var(--fp-panel-bg-soft)] px-3 py-2">
                <span class="min-w-[52px] text-[var(--fp-text-primary)]">移动</span>
                <span>鼠标指向 PDF 变成手型时拖动，可移动裁剪区域。</span>
              </div>
              <div class="flex gap-3 rounded-lg bg-[var(--fp-panel-bg-soft)] px-3 py-2">
                <span class="min-w-[52px] text-[var(--fp-text-primary)]">缩放</span>
                <span>拖动四角圆点可实现等比例缩放。</span>
              </div>
            </div>
          </div>
        </StepCard>

        <StepCard :index="3" title="打水印" desc="X 为左侧偏移，Y 以底部为基准；文本始终贴在页面左下角并排展示。">
          <div class="grid gap-4">
            <WatermarkFieldCard
              v-for="(field, index) in watermarkFields"
              :key="field.id"
              v-model="watermarkFields[index]"
              :resolve-color-display="resolveColorDisplay"
              :on-color-edited="() => markWatermarkColorEdited(field.id)"
            />
          </div>
        </StepCard>

        <StepCard :index="4" title="确认裁剪" desc="点击确认后，可按当前位置导出或打印。">
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.26em] text-white transition hover:-translate-y-0.5 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
              type="button"
              :disabled="exporting"
              @click="exportSnapshot"
            >
              {{ exporting ? '导出中…' : '确认裁剪' }}
            </button>
            <span class="text-xs text-[var(--fp-text-muted)]">文件最终尺寸 10×15CM</span>
          </div>
          <p v-if="exportError" class="text-xs text-red-500">
            {{ exportError }}
          </p>
        </StepCard>
      </div>
    </section>

    <section class="rounded-[28px] border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] p-4 sm:p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-sm font-semibold text-[var(--fp-text-primary)]">
            裁剪预览
          </p>
          <p class="text-xs text-[var(--fp-text-muted)]">
            未上传时显示占位状态，导入后可直接拖拽 PDF。
          </p>
        </div>
        <span class="rounded-full border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg-soft)] px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[var(--fp-text-muted)]">
          FabricCanvas
        </span>
      </div>

      <div class="mt-4 rounded-[24px] border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg-soft)] p-3 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.9)]">
        <div
          class="overflow-hidden rounded-[20px] border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] bg-[linear-gradient(45deg,rgba(148,163,184,0.08)_25%,transparent_25%),linear-gradient(-45deg,rgba(148,163,184,0.08)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(148,163,184,0.08)_75%),linear-gradient(-45deg,transparent_75%,rgba(148,163,184,0.08)_75%)] bg-[length:48px_48px] bg-[position:0_0,0_24px,24px_-24px,-24px_0]"
        >
          <FabricCanvas :canvas-options="canvasOptions" @ready="handleCanvasReady">
            <RenderGroup :priority="0">
              <FabricRect v-model="pageMatte" />
            </RenderGroup>
            <RenderGroup :priority="1">
              <FabricImage
                v-if="pdfLayer"
                v-model="pdfLayer"
                preset="overlay"
              />
              <FabricText
                v-else
                v-model="placeholderLabel"
              />
            </RenderGroup>
            <RenderGroup :priority="2">
              <FabricRect v-model="pageOutline" />
            </RenderGroup>
            <RenderGroup :priority="3">
              <FabricText v-model="watermarkSkuText" />
              <FabricText v-model="watermarkOrderText" />
            </RenderGroup>
          </FabricCanvas>
        </div>
      </div>
    </section>
  </div>
</template>
