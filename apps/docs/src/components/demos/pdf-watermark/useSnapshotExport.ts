import type { Canvas } from 'fabric'
import { ref } from 'vue'

export function useSnapshotExport() {
  const canvasRef = ref<Canvas | null>(null)
  const exporting = ref(false)
  const exportError = ref<string | null>(null)

  const handleCanvasReady = (canvas: Canvas) => {
    canvasRef.value = canvas
  }

  const exportSnapshot = async () => {
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

  return {
    canvasRef,
    exporting,
    exportError,
    handleCanvasReady,
    exportSnapshot,
  }
}
