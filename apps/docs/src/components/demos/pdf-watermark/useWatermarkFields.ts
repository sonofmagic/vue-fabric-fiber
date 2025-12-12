import type { Ref } from 'vue'
import type { FabricTextModelValue } from 'vue-fabric-fiber'
import type { WatermarkAxis, WatermarkField, WatermarkOrigin } from './types'
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

function actualFromAxis(axis: WatermarkAxis, total: number, origin: WatermarkOrigin | undefined, type: 'x' | 'y') {
  const resolvedOrigin = origin ?? 'top-left'
  const offsetPx = axis.px
  const isFromEnd = (type === 'x' && resolvedOrigin.endsWith('right')) || (type === 'y' && resolvedOrigin.startsWith('bottom'))
  return isFromEnd ? total - offsetPx : offsetPx
}

function axisFromActual(actual: number, total: number, origin: WatermarkOrigin | undefined, type: 'x' | 'y'): WatermarkAxis {
  const resolvedOrigin = origin ?? 'top-left'
  const isFromEnd = (type === 'x' && resolvedOrigin.endsWith('right')) || (type === 'y' && resolvedOrigin.startsWith('bottom'))
  const offsetPx = isFromEnd ? total - actual : actual
  const percent = percentFromPx(offsetPx, total)
  return { px: offsetPx, percent }
}

function refreshAxis(axis: WatermarkAxis, total: number) {
  if (!axis) {
    return
  }
  axis.px = Math.round(axis.px)
  axis.percent = percentFromPx(axis.px, total)
}

function resolveFieldPosition(field: WatermarkField, origin: WatermarkOrigin) {
  refreshAxis(field.x, PAGE_WIDTH)
  refreshAxis(field.y, PAGE_HEIGHT)

  const leftPx = pageLeft + actualFromAxis(field.x, PAGE_WIDTH, origin, 'x')
  const topPx = pageTop + actualFromAxis(field.y, PAGE_HEIGHT, origin, 'y')
  return {
    leftPx,
    topPx,
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
    angle: field.angle,
    scale: field.scale,
  }
}

export function useWatermarkFields(themeMode: Ref<'light' | 'dark'>) {
  const origin = ref<WatermarkOrigin>('top-left')
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
      },
      y: {
        px: 40,
        percent: percentFromPx(40, PAGE_HEIGHT),
      },
      opacity: 0.92,
      fontSize: 24,
      angle: 0,
      scale: 1,
    },
    {
      id: 'order',
      label: '销售订单号（订单号过长时超出部分裁断）',
      text: 'Sales Order Number',
      color: '#f8fafc',
      x: {
        px: 170,
        percent: percentFromPx(170, PAGE_WIDTH),
      },
      y: {
        px: 40,
        percent: percentFromPx(40, PAGE_HEIGHT),
      },
      opacity: 0.92,
      fontSize: 24,
      angle: 0,
      scale: 1,
    },
  ])

  const initialSkuPosition = resolveFieldPosition(watermarkFields[0], origin.value)
  const initialOrderPosition = resolveFieldPosition(watermarkFields[1], origin.value)

  const watermarkSkuText = ref<FabricTextModelValue>({
    text: 'ItemCode',
    left: initialSkuPosition.leftPx,
    top: initialSkuPosition.topPx,
    originX: 'left',
    originY: 'top',
    fontSize: watermarkFields[0].fontSize,
    fontFamily: 'Inter',
    fontWeight: '600',
    fill: watermarkFields[0].color,
    opacity: watermarkFields[0].opacity,
    angle: watermarkFields[0].angle,
    scaleX: watermarkFields[0].scale,
    scaleY: watermarkFields[0].scale,
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
    originX: 'left',
    originY: 'top',
    fontSize: watermarkFields[1].fontSize,
    fontFamily: 'Inter',
    fontWeight: '600',
    fill: watermarkFields[1].color,
    opacity: watermarkFields[1].opacity,
    angle: watermarkFields[1].angle,
    scaleX: watermarkFields[1].scale,
    scaleY: watermarkFields[1].scale,
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
    const { leftPx, topPx } = resolveFieldPosition(field, origin.value)

    target.left = leftPx
    target.top = topPx
    target.opacity = field.opacity
    target.fontSize = field.fontSize
    target.text = normalizeText(field.text)
    target.fill = normalizeColor(field.color)
    target.angle = field.angle
    target.scaleX = field.scale
    target.scaleY = field.scale
  }

  const syncModelToField = (target: FabricTextModelValue, field: WatermarkField) => {
    const rect = typeof (target as any)?.getBoundingRect === 'function'
      ? (target as any).getBoundingRect(true, true)
      : null
    const left = rect ? rect.left : target.left ?? pageLeft
    const topCoord = rect ? rect.top : target.top ?? pageTop

    const leftPx = Math.round(left - pageLeft)
    const topPx = Math.round(topCoord - pageTop)
    const leftPercent = typeof (target as any)?.leftPercent === 'number'
      ? (target as any).leftPercent
      : percentFromPx(leftPx, PAGE_WIDTH)
    const topPercent = typeof (target as any)?.topPercent === 'number'
      ? (target as any).topPercent
      : percentFromPx(topPx, PAGE_HEIGHT)

    syncingFromModel.value = true
    const nextX = axisFromActual(leftPx, PAGE_WIDTH, origin.value, 'x')
    const nextY = axisFromActual(topPx, PAGE_HEIGHT, origin.value, 'y')
    field.x.px = nextX.px
    field.x.percent = leftPercent
    field.y.px = nextY.px
    field.y.percent = topPercent

    field.opacity = typeof target.opacity === 'number' ? target.opacity : field.opacity
    field.fontSize = typeof target.fontSize === 'number' ? target.fontSize : field.fontSize
    field.text = normalizeText(target.text)
    field.color = normalizeColor((target as any).fill ?? (target as any).stroke ?? field.color)
    const nextScale = typeof target.scaleX === 'number'
      ? target.scaleX
      : typeof target.scaleY === 'number'
        ? target.scaleY
        : field.scale
    field.scale = nextScale
    field.angle = typeof target.angle === 'number' ? target.angle : field.angle
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

  watch(origin, (next, prev) => {
    if (!prev || next === prev) {
      return
    }
    const fields = [watermarkFields[0], watermarkFields[1]]
    fields.forEach((field) => {
      const actualLeft = actualFromAxis(field.x, PAGE_WIDTH, prev, 'x')
      const actualTop = actualFromAxis(field.y, PAGE_HEIGHT, prev, 'y')
      const nextX = axisFromActual(actualLeft, PAGE_WIDTH, next, 'x')
      const nextY = axisFromActual(actualTop, PAGE_HEIGHT, next, 'y')
      field.x = nextX
      field.y = nextY
    })
    syncFieldToModel(watermarkFields[0], watermarkSkuText.value)
    syncFieldToModel(watermarkFields[1], watermarkOrderText.value)
  })

  return {
    origin,
    watermarkFields,
    watermarkSkuText,
    watermarkOrderText,
    resolveColorDisplay,
    markWatermarkColorEdited,
    watermarkColorEdited,
  }
}
