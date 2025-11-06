import type { PathProps } from 'fabric'
import type { FabricObjectModel } from './types'
import * as fabric from 'fabric'
import { createFabricObjectComponent } from '../createFabricObject'
import { removeUndefined } from '../utils'

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
