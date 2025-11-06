import type { EllipseProps } from 'fabric'
import type { FabricObjectModel } from './types'
import * as fabric from 'fabric'
import { createFabricObjectComponent } from '../createFabricObject'

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
