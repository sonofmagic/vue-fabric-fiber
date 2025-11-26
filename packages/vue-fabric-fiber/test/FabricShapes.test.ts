import type { Context } from '../lib/types'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import {
  FabricCircle,
  FabricEllipse,
  FabricLine,
  FabricPath,
  FabricPolygon,
  FabricPolyline,
  FabricRect,
  FabricTriangle,
} from '../lib/FabricShapes'
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
    const shapes = [
      ['circle', FabricCircle, { radius: 20 }],
      ['ellipse', FabricEllipse, { rx: 30, ry: 20 }],
      ['line', FabricLine, { points: [0, 0, 10, 10] }],
      ['path', FabricPath, { path: 'M0 0 L10 10' }],
      ['polygon', FabricPolygon, { points: [{ x: 0, y: 0 }] }],
      ['polyline', FabricPolyline, { points: [{ x: 0, y: 0 }, { x: 10, y: 10 }] }],
      ['rect', FabricRect, { width: 40, height: 20 }],
      ['triangle', FabricTriangle, { width: 30, height: 30 }],
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
