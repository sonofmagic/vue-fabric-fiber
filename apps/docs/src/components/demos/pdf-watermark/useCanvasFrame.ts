import type { Ref } from 'vue'
import type { FabricRectModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { onMounted, ref, watchEffect } from 'vue'
import {
  canvasCenterX,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  pageLeft,
  pageTop,
  placeholderTextContent,
} from './constants'

function measurePlaceholderTextWidth() {
  if (typeof document === 'undefined') {
    return placeholderTextContent.length * 8
  }
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    return placeholderTextContent.length * 8
  }
  context.font = '600 16px "DM Sans", "Inter", system-ui, -apple-system, sans-serif'
  const metrics = context.measureText(placeholderTextContent)
  return metrics.width
}

export function useCanvasFrame(themeMode: Ref<'light' | 'dark'>) {
  const placeholderTextWidth = ref(measurePlaceholderTextWidth())

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
    text: placeholderTextContent,
    left: canvasCenterX - placeholderTextWidth.value / 2,
    top: pageTop + PAGE_HEIGHT / 2,
    originX: 'left',
    originY: 'center',
    fontSize: 16,
    fontFamily: 'DM Sans',
    fontWeight: '600',
    textAlign: 'center',
    fill: '#cbd5f5',
    opacity: 0.72,
    shadow: 'rgba(2,6,23,0.35) 0px 12px 32px',
    selectable: false,
    evented: false,
  })

  onMounted(() => {
    placeholderTextWidth.value = measurePlaceholderTextWidth()
    placeholderLabel.value.left = canvasCenterX - placeholderTextWidth.value / 2
  })

  watchEffect(() => {
    const isLight = themeMode.value === 'light'
    pageMatte.value.fill = isLight ? 'rgba(226,232,240,0.9)' : 'rgba(2,6,23,0.9)'
    pageMatte.value.stroke = isLight ? 'rgba(148,163,184,0.6)' : 'rgba(100,116,139,0.45)'
    pageOutline.value.fill = isLight ? 'rgba(15,23,42,0.05)' : 'rgba(148,163,184,0.05)'
    pageOutline.value.stroke = isLight ? '#0ea5e9' : '#38bdf8'
    placeholderLabel.value.fill = isLight ? '#475569' : '#cbd5f5'
    placeholderLabel.value.shadow = isLight ? 'rgba(15,23,42,0.22) 0px 10px 26px' : 'rgba(2,6,23,0.35) 0px 12px 32px'
  })

  return {
    pageMatte,
    pageOutline,
    placeholderLabel,
  }
}
