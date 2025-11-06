import type {
  FabricObjectProps,
  SerializedPolylineProps,
  XY,
} from 'fabric'
import type { FabricObjectModel } from './types'
import * as fabric from 'fabric'
import { createFabricObjectComponent } from '../createFabricObject'
import { removeUndefined } from '../utils'

type PolyPoints = SerializedPolylineProps['points']
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
