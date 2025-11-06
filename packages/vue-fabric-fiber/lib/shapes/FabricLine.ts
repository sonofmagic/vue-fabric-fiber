import type { FabricObjectProps } from 'fabric'
import type { FabricObjectModel } from './types'
import * as fabric from 'fabric'
import { createFabricObjectComponent } from '../createFabricObject'
import { removeUndefined } from '../utils'

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
