import type { CircleProps } from 'fabric'
import type { FabricObjectModel } from './types'
import * as fabric from 'fabric'
import { createFabricObjectComponent } from '../createFabricObject'

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
