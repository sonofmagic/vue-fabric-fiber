import type { Ref } from 'vue'
import type { FabricTextModelValue } from 'vue-fabric-fiber'
import type { WatermarkField } from './types'
import { reactive, ref, watch, watchEffect } from 'vue'
import { pageBottom, pageLeft } from './constants'

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

export function useWatermarkFields(themeMode: Ref<'light' | 'dark'>) {
  const watermarkColorEdited = reactive<Record<WatermarkField['id'], boolean>>({
    sku: false,
    order: false,
  })
  const watermarkFields = reactive<WatermarkField[]>([
    {
      id: 'sku',
      label: '发货SKU Code或Repack',
      text: 'ItemCode',
      color: '#f8fafc',
      x: 12,
      bottom: 40,
      opacity: 0.92,
      fontSize: 24,
    },
    {
      id: 'order',
      label: '销售订单号（订单号过长时超出部分裁断）',
      text: 'Sales Order Number',
      color: '#f8fafc',
      x: 170,
      bottom: 40,
      opacity: 0.92,
      fontSize: 24,
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

  const syncingFromModel = ref(false)

  const markWatermarkColorEdited = (id: WatermarkField['id']) => {
    watermarkColorEdited[id] = true
  }

  watchEffect(() => {
    const defaultWatermarkColor = themeMode.value === 'light' ? '#0f172a' : '#f8fafc'
    if (!watermarkColorEdited.sku) {
      watermarkFields[0].color = defaultWatermarkColor
    }
    if (!watermarkColorEdited.order) {
      watermarkFields[1].color = defaultWatermarkColor
    }
  })

  const syncFieldToModel = (field: WatermarkField, target: FabricTextModelValue) => {
    target.left = pageLeft + field.x
    target.top = pageBottom - field.bottom
    target.opacity = field.opacity
    target.fontSize = field.fontSize
    target.text = normalizeText(field.text)
    target.fill = normalizeColor(field.color)
  }

  const syncModelToField = (target: FabricTextModelValue, field: WatermarkField) => {
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

  return {
    watermarkFields,
    watermarkSkuText,
    watermarkOrderText,
    resolveColorDisplay,
    markWatermarkColorEdited,
    watermarkColorEdited,
  }
}
