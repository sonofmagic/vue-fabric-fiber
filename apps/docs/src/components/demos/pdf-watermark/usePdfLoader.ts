import type { FabricImageModelValue } from 'vue-fabric-fiber'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import { computed, ref } from 'vue'
import { PAGE_HEIGHT, PAGE_WIDTH, pageLeft, pageTop } from './constants'

const workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = workerSrc
}

function normalizeFileType(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export function usePdfLoader() {
  const pdfLayer = ref<FabricImageModelValue | null>(null)
  const pdfFileName = ref('尚未上传')
  const pdfLoading = ref(false)
  const pdfError = ref<string | null>(null)

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
    const delta = direction === 'cw' ? 90 : -90
    const angle = pdfLayer.value.angle ?? 0
    const normalized = (angle + delta + 360) % 360
    pdfLayer.value.angle = normalized
  }

  const resetPdf = () => {
    pdfLayer.value = null
    pdfFileName.value = '尚未上传'
    pdfError.value = null
  }

  return {
    pdfLayer,
    pdfFileName,
    pdfLoading,
    pdfError,
    pdfLoaded,
    rotationLabel,
    scaleLabel,
    handleFileChange,
    rotatePdf,
    resetPdf,
  }
}
