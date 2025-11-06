import type { RectProps } from 'fabric'
import type { FabricObjectModel } from './types'
import * as fabric from 'fabric'
import { createFabricObjectComponent } from '../createFabricObject'

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
