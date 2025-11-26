import type { Ref } from 'vue'
import type { FabricTextModelValue } from 'vue-fabric-fiber'
import { Shadow } from 'fabric'
import { onMounted, ref, watchEffect } from 'vue'
import {
  canvasCenterX,
  PAGE_HEIGHT,
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

function createShadow(color: string, blur: number, offsetY: number) {
  return new Shadow({
    color,
    blur,
    offsetX: 0,
    offsetY,
  })
}

export function useCanvasFrame(themeMode: Ref<'light' | 'dark'>) {
  const placeholderTextWidth = ref(measurePlaceholderTextWidth())

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
    shadow: createShadow('rgba(2,6,23,0.35)', 32, 12),
    selectable: false,
    evented: false,
  })

  onMounted(() => {
    placeholderTextWidth.value = measurePlaceholderTextWidth()
    placeholderLabel.value.left = canvasCenterX - placeholderTextWidth.value / 2
  })

  watchEffect(() => {
    const isLight = themeMode.value === 'light'
    placeholderLabel.value.fill = isLight ? '#475569' : '#cbd5f5'
    placeholderLabel.value.shadow = isLight
      ? createShadow('rgba(15,23,42,0.22)', 26, 10)
      : createShadow('rgba(2,6,23,0.35)', 32, 12)
  })

  return {
    placeholderLabel,
  }
}
