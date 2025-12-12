import type { Ref } from 'vue'
import type { FabricTextModelValue } from 'vue-fabric-fiber'
import type { WatermarkAxis, WatermarkField } from './types'
import { reactive, ref, watch, watchEffect } from 'vue'
import { PAGE_HEIGHT, PAGE_WIDTH, pageLeft, pageTop } from './constants'

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

function percentFromPx(px: number, total: number) {
  if (!Number.isFinite(px) || !Number.isFinite(total) || total === 0) {
    return 0
  }
  return Number(((px / total) * 100).toFixed(2))
}

function pxFromPercent(percent: number, total: number) {
  if (!Number.isFinite(percent) || !Number.isFinite(total)) {
    return 0
  }
  return (percent / 100) * total
}

function refreshAxis(axis: WatermarkAxis, total: number) {
  if (!axis) {
    return
  }
  if (axis.unit === '%') {
    axis.percent = Math.max(0, axis.percent)
    axis.px = Math.round(pxFromPercent(axis.percent, total))
  }
  else {
    axis.px = Math.max(0, Math.round(axis.px))
    axis.percent = percentFromPx(axis.px, total)
  }
}

function resolveFieldPosition(field: WatermarkField) {
  refreshAxis(field.x, PAGE_WIDTH)
  refreshAxis(field.y, PAGE_HEIGHT)

  const leftPx = pageLeft + field.x.px
  const topPx = pageTop + field.y.px
  const leftUnit = field.x.unit
  const topUnit = field.y.unit === '%' ? '%' : 'px'
  const leftPercent = percentFromPx(leftPx, PAGE_WIDTH)
  const topPercent = percentFromPx(topPx, PAGE_HEIGHT)

  return {
    leftPx,
    topPx,
    position: {
      left: {
        value: leftUnit === '%' ? field.x.percent : leftPx,
        unit: leftUnit,
        px: leftPx,
        percent: leftPercent,
      },
      top: {
        value: topUnit === '%' ? topPercent : topPx,
        unit: topUnit,
        px: topPx,
        percent: topPercent,
      },
    },
  }
}

function selectFieldSnapshot(field: WatermarkField) {
  return {
    x: { ...field.x },
    y: { ...field.y },
    opacity: field.opacity,
    fontSize: field.fontSize,
    text: field.text,
    color: field.color,
  }
}

export function useWatermarkFields(themeMode: Ref<'light' | 'dark'>) {
  const watermarkColorEdited = reactive<Record<WatermarkField['id'], boolean>>({
    sku: false,
    order: false,
  })
  const watermarkFields = reactive<[WatermarkField, WatermarkField]>([
    {
      id: 'sku',
      label: '发货SKU Code或Repack',
      text: 'ItemCode',
      color: '#f8fafc',
      x: {
        px: 12,
        percent: percentFromPx(12, PAGE_WIDTH),
        unit: 'px',
      },
      y: {
        px: 40,
        percent: percentFromPx(40, PAGE_HEIGHT),
        unit: 'px',
      },
      opacity: 0.92,
      fontSize: 24,
    },
    {
      id: 'order',
      label: '销售订单号（订单号过长时超出部分裁断）',
      text: 'Sales Order Number',
      color: '#f8fafc',
      x: {
        px: 170,
        percent: percentFromPx(170, PAGE_WIDTH),
        unit: 'px',
      },
      y: {
        px: 40,
        percent: percentFromPx(40, PAGE_HEIGHT),
        unit: 'px',
      },
      opacity: 0.92,
      fontSize: 24,
    },
  ])

  const initialSkuPosition = resolveFieldPosition(watermarkFields[0])
  const initialOrderPosition = resolveFieldPosition(watermarkFields[1])

  const watermarkSkuText = ref<FabricTextModelValue>({
    text: 'ItemCode',
    left: initialSkuPosition.leftPx,
    top: initialSkuPosition.topPx,
    position: initialSkuPosition.position,
    originX: 'left',
    originY: 'top',
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
    left: initialOrderPosition.leftPx,
    top: initialOrderPosition.topPx,
    position: initialOrderPosition.position,
    originX: 'left',
    originY: 'top',
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
    const { leftPx, topPx, position } = resolveFieldPosition(field)

    target.left = leftPx
    target.top = topPx
    target.position = position
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
    const topCoord = rect ? rect.top : target.top ?? pageTop

    const leftPx = Math.max(0, Math.round(left - pageLeft))
    const topPx = Math.max(0, Math.round(topCoord - pageTop))

    syncingFromModel.value = true
    field.x.px = leftPx
    field.x.percent = percentFromPx(leftPx, PAGE_WIDTH)
    refreshAxis(field.x, PAGE_WIDTH)

    field.y.px = topPx
    field.y.percent = percentFromPx(topPx, PAGE_HEIGHT)
    refreshAxis(field.y, PAGE_HEIGHT)

    field.opacity = typeof target.opacity === 'number' ? target.opacity : field.opacity
    field.fontSize = typeof target.fontSize === 'number' ? target.fontSize : field.fontSize
    field.text = normalizeText(target.text)
    field.color = normalizeColor((target as any).fill ?? (target as any).stroke ?? field.color)
    syncingFromModel.value = false
  }

  watch(
    () => selectFieldSnapshot(watermarkFields[0]),
    () => {
      if (syncingFromModel.value) {
        return
      }
      syncFieldToModel(watermarkFields[0], watermarkSkuText.value)
    },
    { deep: true },
  )

  watch(
    watermarkSkuText,
    (next) => {
      syncModelToField(next, watermarkFields[0])
    },
    { deep: true },
  )

  watch(
    () => selectFieldSnapshot(watermarkFields[1]),
    () => {
      if (syncingFromModel.value) {
        return
      }
      syncFieldToModel(watermarkFields[1], watermarkOrderText.value)
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
