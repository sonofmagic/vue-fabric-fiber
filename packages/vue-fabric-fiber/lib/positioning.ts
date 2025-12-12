import type { Context } from './types'

export type PositionOrigin = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type Axis = 'left' | 'top'
type PercentAxis = 'leftPercent' | 'topPercent'

interface DimensionLike {
  width?: number
  height?: number
}

function parsePercent(input: string) {
  if (!input.trim().endsWith('%')) {
    return undefined
  }
  const value = Number.parseFloat(input.trim().slice(0, -1))
  return Number.isFinite(value) ? value : undefined
}

function normalizeAxis(input: unknown): { unit: 'px' | '%', value: number } | undefined {
  if (typeof input === 'number' && Number.isFinite(input)) {
    return { unit: 'px', value: input }
  }
  if (typeof input === 'string') {
    const percent = parsePercent(input)
    if (percent !== undefined) {
      return { unit: '%', value: percent }
    }
  }
  return undefined
}

function resolvePercentValue(raw: unknown) {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw
  }
  if (typeof raw === 'string') {
    return parsePercent(raw)
  }
  return undefined
}

function resolveAxisValue(
  raw: unknown,
  size?: number,
  current?: number,
  percent?: number,
): number | undefined {
  const spec = normalizeAxis(raw)
  if (!spec) {
    if (percent === undefined) {
      return undefined
    }
    if (typeof size === 'number' && Number.isFinite(size)) {
      return size * (percent / 100)
    }
    return current
  }

  if (spec.unit === '%') {
    if (typeof size === 'number' && Number.isFinite(size)) {
      return size * (spec.value / 100)
    }
    return current
  }

  return spec.value
}

export function getCanvasDimensions(ctx?: Context): DimensionLike {
  const width = ctx?.fabricCanvas?.getWidth() ?? ctx?.canvasEl?.width
  const height = ctx?.fabricCanvas?.getHeight() ?? ctx?.canvasEl?.height
  return { width, height }
}

export function applyPositionIntent<T extends Record<string, any>>(
  model: T,
  ctx?: Context,
  current?: { left?: number, top?: number },
  fallbackOrigin?: PositionOrigin,
): T {
  const next = { ...model }
  const { width, height } = getCanvasDimensions(ctx)
  const origin: PositionOrigin = fallbackOrigin ?? 'top-left'
  const axes: readonly Axis[] = ['left', 'top']
  const percentAxis: Record<Axis, PercentAxis> = {
    left: 'leftPercent',
    top: 'topPercent',
  }

  axes.forEach((axis: Axis) => {
    const size = axis === 'left' ? width : height
    const raw = (model as Record<Axis, unknown>)[axis]
    const percentValue = resolvePercentValue((model as Record<PercentAxis, unknown>)[percentAxis[axis]])
    const resolved = resolveAxisValue(
      raw,
      size,
      axis === 'left' ? current?.left : current?.top,
      percentValue,
    )

    if (resolved === undefined) {
      delete (next as Record<PercentAxis, unknown>)[percentAxis[axis]]
      return
    }

    let actual = resolved
    const isFromRight = origin.endsWith('right') && axis === 'left'
    const isFromBottom = origin.startsWith('bottom') && axis === 'top'

    if ((isFromRight || isFromBottom) && typeof size === 'number') {
      actual = size - resolved
    }

    (next as Record<string, unknown>)[axis] = actual
    delete (next as Record<PercentAxis, unknown>)[percentAxis[axis]]
  })

  return next
}
