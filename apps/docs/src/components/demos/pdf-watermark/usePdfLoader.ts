import type { FabricImageModelValue } from 'vue-fabric-fiber'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import { computed, ref } from 'vue'
import { PAGE_HEIGHT, PAGE_WIDTH, pageLeft, pageTop } from './constants'

const workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = workerSrc
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function normalizeFileType(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export function usePdfLoader() {
  const pdfLayer = ref<FabricImageModelValue | null>(null)
  const pdfFileName = ref('尚未上传')
  const pdfLoading = ref(false)
  const pdfError = ref<string | null>(null)
  const initialScale = ref<number | null>(null)

  const pdfLoaded = computed(() => Boolean(pdfLayer.value))
  const rotationLabel = computed(() => {
    if (!pdfLayer.value) {
      return '0°'
    }
    const angle = pdfLayer.value.angle ?? 0
    return `${Math.round((angle + 360) % 360)}°`
  })
  const scaleLabel = computed(() => {
    const fallbackScale = initialScale.value ?? 1
    const layer = pdfLayer.value
    if (!layer) {
      const pendingUniform = Math.round(fallbackScale * 100)
      return `${pendingUniform}%`
    }
    const scaleX = toNumber(layer.scaleX, fallbackScale)
    const scaleY = toNumber(layer.scaleY, fallbackScale)
    const uniform = Math.round(Math.min(scaleX, scaleY) * 100)
    return `${uniform}%`
  })
  const pdfMetrics = computed(() => {
    const layer = pdfLayer.value
    if (!layer) {
      return null
    }
    const scaleX = toNumber(layer.scaleX, 1)
    const scaleY = toNumber(layer.scaleY, 1)
    const width = toNumber(layer.width)
    const height = toNumber(layer.height)
    return {
      left: toNumber(layer.left),
      top: toNumber(layer.top),
      angle: Math.round((toNumber(layer.angle) + 360) % 360),
      scaleX,
      scaleY,
      renderedWidth: Math.round(width * scaleX),
      renderedHeight: Math.round(height * scaleY),
    }
  })

  const loadPdf = async (file: File) => {
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
        canvas: renderCanvas,
        canvasContext: context,
        viewport,
      }).promise

      const src = renderCanvas.toDataURL('image/png')

      const padding = 36
      const availableWidth = PAGE_WIDTH - padding
      const availableHeight = PAGE_HEIGHT - padding
      const fitScale = Math.min(availableWidth / viewport.width, availableHeight / viewport.height, 1)

      const renderWidth = viewport.width * fitScale
      const renderHeight = viewport.height * fitScale
      const centerLeft = pageLeft + (PAGE_WIDTH - renderWidth) / 2
      const centerTop = pageTop + (PAGE_HEIGHT - renderHeight) / 2

      initialScale.value = fitScale
      pdfLayer.value = {
        src,
        left: centerLeft,
        top: centerTop,
        width: viewport.width,
        height: viewport.height,
        scaleX: fitScale,
        scaleY: fitScale,
        originX: 'left',
        originY: 'top',
        angle: 0,
        hoverCursor: 'move',
        centeredRotation: true,
        centeredScaling: false,
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

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const [file] = target.files || []
    if (!file) {
      return
    }
    void loadPdf(file)
    target.value = ''
  }

  const rotatePdf = (direction: 'cw' | 'ccw') => {
    if (!pdfLayer.value) {
      return
    }
    const layer = pdfLayer.value
    const delta = direction === 'cw' ? 90 : -90
    const angle = toNumber(layer.angle)
    const normalized = (angle + delta + 360) % 360
    const scaleX = toNumber(layer.scaleX, 1)
    const scaleY = toNumber(layer.scaleY, 1)
    const width = toNumber(layer.width)
    const height = toNumber(layer.height)
    const dx = (width * scaleX) / 2
    const dy = (height * scaleY) / 2
    const rad = angle * Math.PI / 180
    const centerOffsetX = Math.cos(rad) * dx - Math.sin(rad) * dy
    const centerOffsetY = Math.sin(rad) * dx + Math.cos(rad) * dy
    const worldCenterX = toNumber(layer.left) + centerOffsetX
    const worldCenterY = toNumber(layer.top) + centerOffsetY
    const nextRad = normalized * Math.PI / 180
    const nextOffsetX = Math.cos(nextRad) * dx - Math.sin(nextRad) * dy
    const nextOffsetY = Math.sin(nextRad) * dx + Math.cos(nextRad) * dy
    layer.left = worldCenterX - nextOffsetX
    layer.top = worldCenterY - nextOffsetY
    layer.angle = normalized
  }

  const resetPdf = () => {
    pdfLayer.value = null
    pdfFileName.value = '尚未上传'
    pdfError.value = null
    initialScale.value = null
  }

  return {
    pdfLayer,
    pdfFileName,
    pdfLoading,
    pdfError,
    pdfLoaded,
    rotationLabel,
    scaleLabel,
    pdfMetrics,
    handleFileChange,
    rotatePdf,
    resetPdf,
  }
}
