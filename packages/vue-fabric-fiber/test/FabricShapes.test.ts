import type { Context } from '../lib/types'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ContextKey } from '../lib/symbols'
import { createFabricMock } from './mocks/fabric'
import { mountComponent } from './test-utils'

const fabricMockState = vi.hoisted(() => {
  let accessor: () => ReturnType<typeof createFabricMock> = () => {
    throw new Error('Fabric mock was not initialized')
  }
  return {
    getAccessor: () => accessor,
    setAccessor: (mock: ReturnType<typeof createFabricMock>) => {
      accessor = () => mock
    },
  }
})

vi.mock('fabric', () => {
  const mock = createFabricMock()
  fabricMockState.setAccessor(mock)
  return mock.module
})

type FabricShapesModule = typeof import('../lib/FabricShapes')
let Shapes: FabricShapesModule | undefined

beforeAll(async () => {
  Shapes = await import('../lib/FabricShapes')
})

function createShapeContext(): Context {
  return {
    addObject: vi.fn(),
    removeObject: vi.fn(),
    addSequentialTask: vi.fn(async (task: () => void) => task()),
    taskQueue: {} as any,
    canvasEl: document.createElement('canvas'),
    containerEl: document.createElement('div'),
    claimObjectSequence: () => 0,
    fabricCanvas: undefined,
  }
}

describe('Fabric shape components', () => {
  it('instantiates each shape through the shared factory', async () => {
    const module = Shapes!
    const shapes = [
      ['circle', module.FabricCircle, { radius: 20 }],
      ['ellipse', module.FabricEllipse, { rx: 30, ry: 20 }],
      ['line', module.FabricLine, { points: [0, 0, 10, 10] }],
      ['path', module.FabricPath, { path: 'M0 0 L10 10' }],
      ['polygon', module.FabricPolygon, { points: [{ x: 0, y: 0 }] }],
      ['polyline', module.FabricPolyline, { points: [{ x: 0, y: 0 }, { x: 10, y: 10 }] }],
      ['rect', module.FabricRect, { width: 40, height: 20 }],
      ['triangle', module.FabricTriangle, { width: 30, height: 30 }],
    ] as const

    for (const [, component, modelValue] of shapes) {
      const ctx = createShapeContext()
      const wrapper = mountComponent(component, {
        props: {
          modelValue,
        },
        provide: [[ContextKey, ctx]],
      })
      await nextTick()
      expect(ctx.addObject).toHaveBeenCalledTimes(1)
      wrapper.unmount()
    }
  })
})
