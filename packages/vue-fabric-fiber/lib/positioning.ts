import type { Context } from './types'

export type PositionUnit = 'px' | '%'

export interface AxisPositionInput {
  value: number
  unit?: PositionUnit
  px?: number
  percent?: number
}

export interface ObjectPosition {
  left?: AxisPositionInput
  top?: AxisPositionInput
}

type Axis = 'left' | 'top'

interface DimensionLike {
  width?: number
  height?: number
}

interface PositionLike {
  position?: ObjectPosition
  left?: number
  top?: number
}

const AXES: readonly Axis[] = ['left', 'top']

export function getCanvasDimensions(ctx?: Context): DimensionLike {
  const width = ctx?.fabricCanvas?.getWidth() ?? ctx?.canvasEl?.width
  const height = ctx?.fabricCanvas?.getHeight() ?? ctx?.canvasEl?.height
  return { width, height }
}

export function normalizeAxisPosition(
  input: AxisPositionInput | number | undefined,
): AxisPositionInput | undefined {
  if (typeof input === 'number' && Number.isFinite(input)) {
    return {
      value: input,
      unit: 'px',
    }
  }

  if (input && typeof input === 'object' && Number.isFinite(input.value)) {
    const unit = input.unit === '%' ? '%' : 'px'
    return {
      value: input.value,
      unit,
    }
  }

  return undefined
}

function resolveAxisValue(
  spec: AxisPositionInput,
  size?: number,
  current?: number,
) {
  if (spec.unit === '%') {
    if (typeof size === 'number' && Number.isFinite(size)) {
      return size * (spec.value / 100)
    }
    if (typeof current === 'number' && Number.isFinite(current)) {
      return current
    }
    return undefined
  }
  return spec.value
}

function axisValuesConflict(
  primary: AxisPositionInput,
  fallback: AxisPositionInput | undefined,
  size?: number,
) {
  if (!fallback) {
    return false
  }

  const primaryPx = resolveAxisValue(primary, size)
  const fallbackPx = resolveAxisValue(fallback, size)
  if (primaryPx === undefined || fallbackPx === undefined) {
    return false
  }

  const delta = Math.abs(primaryPx - fallbackPx)
  return delta > 0.01
}

export function applyPositionIntent<T extends Record<string, any>>(
  model: T,
  ctx?: Context,
  current?: { left?: number, top?: number },
  onConflict?: (axis: Axis) => void,
): T {
  const next = { ...model }
  const { width, height } = getCanvasDimensions(ctx)

  AXES.forEach((axis) => {
    const positionSpec = normalizeAxisPosition((model as PositionLike).position?.[axis])
    const legacySpec = normalizeAxisPosition((model as PositionLike)[axis])
    const size = axis === 'left' ? width : height
    const resolvedSource = positionSpec ?? legacySpec

    if (positionSpec && axisValuesConflict(positionSpec, legacySpec, size)) {
      onConflict?.(axis)
    }

    if (!resolvedSource) {
      return
    }

    const resolvedValue = resolveAxisValue(
      resolvedSource,
      size,
      axis === 'left' ? current?.left : current?.top,
    )
    if (resolvedValue !== undefined) {
      ;(next as Record<string, unknown>)[axis] = resolvedValue
    }
  })

  if ('position' in next) {
    delete (next as Record<string, unknown>).position
  }

  return next
}

export function buildPositionSnapshot(
  source: PositionLike | undefined,
  coords: { left?: number, top?: number },
  ctx?: Context,
): Partial<PositionLike> {
  const snapshot: Partial<PositionLike> = {}
  if (coords.left !== undefined) {
    snapshot.left = coords.left
  }
  if (coords.top !== undefined) {
    snapshot.top = coords.top
  }

  if (!source?.position) {
    return snapshot
  }

  const { width, height } = getCanvasDimensions(ctx)
  const position: ObjectPosition = {}

  AXES.forEach((axis) => {
    const spec = normalizeAxisPosition(source.position?.[axis])
    const coord = axis === 'left' ? coords.left : coords.top
    const size = axis === 'left' ? width : height

    if (!spec || coord === undefined) {
      return
    }

    const pxValue = Number.isFinite(coord) ? coord : spec.px
    const percentValue = (
      typeof size === 'number' && Number.isFinite(size) && typeof coord === 'number'
    )
      ? (coord / size) * 100
      : spec.unit === '%' ? spec.value : spec.percent

    position[axis] = {
      value: spec.unit === '%' ? (percentValue ?? spec.value) : (pxValue ?? spec.value),
      unit: spec.unit ?? 'px',
      px: pxValue,
      percent: percentValue,
    }
  })

  if (Object.keys(position).length > 0) {
    snapshot.position = position
  }

  return snapshot
}

export function createPositionConflictLogger(componentName: string) {
  const warnedAxes = new Set<Axis>()
  return (axis: Axis) => {
    if (warnedAxes.has(axis)) {
      return
    }
    warnedAxes.add(axis)
    console.warn(
      `[vue-fabric-fiber][${componentName}] Both position.${axis} and ${axis} were provided; `
      + 'prefer a single source to avoid ambiguity. The position.* value takes precedence when present.',
    )
  }
}
