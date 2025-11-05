import type {
  CircleProps,
  EllipseProps,
  FabricObjectProps,
  PathProps,
  RectProps,
  SerializedPolylineProps,
  XY,
} from 'fabric'
import * as fabric from 'fabric'
import { createFabricObjectComponent } from './createFabricObject'
import { removeUndefined } from './utils'

type FabricObjectModel<T, ExtraOmit extends keyof T = never> = Partial<
  Omit<T, 'clipPath' | 'canvas' | ExtraOmit>
>

export type FabricRectModelValue = FabricObjectModel<RectProps>
export const FabricRect = createFabricObjectComponent<
  FabricRectModelValue,
  fabric.Rect
>({
  name: 'FabricRect',
  defaults: () => ({
    width: 160,
    height: 120,
    fill: '#38bdf8',
    left: 100,
    top: 80,
  }),
  createInstance(initial) {
    return new fabric.Rect(initial as RectProps)
  },
})

export type FabricCircleModelValue = FabricObjectModel<CircleProps>
export const FabricCircle = createFabricObjectComponent<
  FabricCircleModelValue,
  fabric.Circle
>({
  name: 'FabricCircle',
  defaults: () => ({
    radius: 60,
    fill: '#f472b6',
    left: 260,
    top: 120,
  }),
  createInstance(initial) {
    return new fabric.Circle(initial as CircleProps)
  },
})

export type FabricEllipseModelValue = FabricObjectModel<EllipseProps>
export const FabricEllipse = createFabricObjectComponent<
  FabricEllipseModelValue,
  fabric.Ellipse
>({
  name: 'FabricEllipse',
  defaults: () => ({
    rx: 90,
    ry: 60,
    fill: '#34d399',
    left: 360,
    top: 200,
  }),
  createInstance(initial) {
    return new fabric.Ellipse(initial as EllipseProps)
  },
})

export type FabricTriangleModelValue = FabricObjectModel<FabricObjectProps> & {
  width?: number
  height?: number
}
export const FabricTriangle = createFabricObjectComponent<
  FabricTriangleModelValue,
  fabric.Triangle
>({
  name: 'FabricTriangle',
  defaults: () => ({
    width: 140,
    height: 140,
    fill: '#fb923c',
    left: 520,
    top: 120,
  }),
  createInstance(initial) {
    return new fabric.Triangle(initial as Partial<FabricObjectProps>)
  },
})

type LineCoordinates = Pick<fabric.Line, 'x1' | 'x2' | 'y1' | 'y2'>
export type FabricLineModelValue = FabricObjectModel<FabricObjectProps>
  & Partial<LineCoordinates>
export const FabricLine = createFabricObjectComponent<
  FabricLineModelValue,
  fabric.Line
>({
  name: 'FabricLine',
  defaults: () => ({
    x1: 80,
    y1: 400,
    x2: 360,
    y2: 400,
    stroke: '#f87171',
    strokeWidth: 6,
    strokeLineCap: 'round',
  }),
  createInstance(initial) {
    const { x1 = 0, y1 = 0, x2 = 0, y2 = 0, ...rest } = initial
    return new fabric.Line([x1, y1, x2, y2], rest as Partial<FabricObjectProps>)
  },
  applyProps(instance, next) {
    instance.set(removeUndefined(next) as Record<string, unknown>)
  },
})

export type FabricPathSource = string
export type FabricPathModelValue = FabricObjectModel<PathProps, 'path'> & {
  path?: FabricPathSource
  sourcePath?: string
}
export const FabricPath = createFabricObjectComponent<
  FabricPathModelValue,
  fabric.Path
>({
  name: 'FabricPath',
  defaults: () => ({
    path: 'M 40 40 C 160 0 160 160 40 120 z',
    fill: 'rgba(56,189,248,0.12)',
    stroke: '#38bdf8',
    strokeWidth: 3,
    left: 120,
    top: 220,
  }),
  createInstance(initial) {
    const { path, ...rest } = initial
    const resolvedPath = path ?? 'M 0 0 L 120 0 L 60 100 z'
    return new fabric.Path(
      resolvedPath,
      rest as Partial<PathProps>,
    )
  },
  applyProps(instance, next) {
    const { path, ...rest } = next
    if (path !== undefined) {
      const parsedPath = typeof path === 'string'
        ? fabric.util.parsePath(path)
        : path
      instance.set({ path: parsedPath as PathProps['path'] })
    }
    instance.set(removeUndefined(rest) as Record<string, unknown>)
  },
})

type PolyPoints = SerializedPolylineProps['points']
export type FabricPolylineModelValue = FabricObjectModel<FabricObjectProps> & {
  points: PolyPoints
}
export const FabricPolyline = createFabricObjectComponent<
  FabricPolylineModelValue,
  fabric.Polyline
>({
  name: 'FabricPolyline',
  defaults: () => ({
    points: [
      { x: 0, y: 40 },
      { x: 80, y: 0 },
      { x: 180, y: 40 },
      { x: 240, y: 20 },
      { x: 300, y: 80 },
    ] satisfies XY[],
    stroke: '#a855f7',
    strokeWidth: 4,
    fill: '',
    left: 420,
    top: 300,
  }),
  createInstance(initial) {
    const { points, ...rest } = initial
    return new fabric.Polyline(
      points ?? [],
      rest as Partial<FabricObjectProps>,
    )
  },
  applyProps(instance, next) {
    const { points, ...rest } = next
    if (points) {
      instance.set({ points })
    }
    instance.set(removeUndefined(rest) as Record<string, unknown>)
  },
})

export type FabricPolygonModelValue = FabricObjectModel<FabricObjectProps> & {
  points: PolyPoints
}
export const FabricPolygon = createFabricObjectComponent<
  FabricPolygonModelValue,
  fabric.Polygon
>({
  name: 'FabricPolygon',
  defaults: () => ({
    points: [
      { x: 0, y: 120 },
      { x: 100, y: 0 },
      { x: 220, y: 120 },
      { x: 180, y: 220 },
      { x: 40, y: 220 },
    ] satisfies XY[],
    fill: 'rgba(244,114,182,0.2)',
    stroke: '#f472b6',
    strokeWidth: 3,
    left: 600,
    top: 220,
  }),
  createInstance(initial) {
    const { points, ...rest } = initial
    return new fabric.Polygon(
      points ?? [],
      rest as Partial<FabricObjectProps>,
    )
  },
  applyProps(instance, next) {
    const { points, ...rest } = next
    if (points) {
      instance.set({ points })
    }
    instance.set(removeUndefined(rest) as Record<string, unknown>)
  },
})
