<script setup lang="ts">
import type { WatermarkField } from './pdf-watermark/types'
import { canvasOptions, watermarkBottomMax, watermarkXMax } from './pdf-watermark/constants'
import PdfWatermarkControls from './pdf-watermark/PdfWatermarkControls.vue'
import PdfWatermarkPreview from './pdf-watermark/PdfWatermarkPreview.vue'
import { useCanvasFrame } from './pdf-watermark/useCanvasFrame'
import { usePdfLoader } from './pdf-watermark/usePdfLoader'
import { useSnapshotExport } from './pdf-watermark/useSnapshotExport'
import { useThemeMode } from './pdf-watermark/useThemeMode'
import { useWatermarkFields } from './pdf-watermark/useWatermarkFields'

const { themeMode } = useThemeMode()
const { placeholderLabel } = useCanvasFrame(themeMode)
const {
  watermarkFields,
  watermarkSkuText,
  watermarkOrderText,
  resolveColorDisplay,
  markWatermarkColorEdited,
} = useWatermarkFields(themeMode)
const {
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
} = usePdfLoader()
const {
  exporting,
  exportError,
  handleCanvasReady,
  exportSnapshot,
} = useSnapshotExport()

function updateWatermarkField(index: number, value: WatermarkField) {
  watermarkFields[index] = value
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)]">
    <PdfWatermarkControls
      :pdf-loading="pdfLoading"
      :pdf-file-name="pdfFileName"
      :pdf-error="pdfError"
      :pdf-loaded="pdfLoaded"
      :rotation-label="rotationLabel"
      :scale-label="scaleLabel"
      :watermark-fields="watermarkFields"
      :watermark-x-max="watermarkXMax"
      :watermark-bottom-max="watermarkBottomMax"
      :resolve-color-display="resolveColorDisplay"
      :exporting="exporting"
      :export-error="exportError"
      :on-file-change="handleFileChange"
      :pdf-metrics="pdfMetrics"
      :on-reset-pdf="resetPdf"
      :on-rotate="rotatePdf"
      :on-export="exportSnapshot"
      :on-color-edited="markWatermarkColorEdited"
      :on-update-field="updateWatermarkField"
    />

    <PdfWatermarkPreview
      v-model:pdf-layer="pdfLayer"
      v-model:placeholder-label="placeholderLabel"
      v-model:watermark-sku-text="watermarkSkuText"
      v-model:watermark-order-text="watermarkOrderText"
      :canvas-options="canvasOptions"
      :on-canvas-ready="handleCanvasReady"
    />
  </div>
</template>
