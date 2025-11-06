import type { FabricObjectProps } from 'fabric'
import type { FabricObjectModel } from './types'
import * as fabric from 'fabric'
import { createFabricObjectComponent } from '../createFabricObject'

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
