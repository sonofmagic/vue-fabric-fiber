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
