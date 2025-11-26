import type { Context } from '../lib/types'
import * as fabric from 'fabric'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { FabricText } from '../lib/FabricText'
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

const getFabricMock = () => fabricMockState.getAccessor()()

async function flushTextTasks() {
  await Promise.resolve()
  await Promise.resolve()
}

function createTextContext(overrides: Partial<Context> = {}) {
  const canvasElement = document.createElement('canvas')
  const fabricCanvas = new fabric.Canvas(canvasElement, { width: 500, height: 300 }) as fabric.Canvas & {
    renderAll: ReturnType<typeof vi.fn>
  }
  fabricCanvas.renderAll = vi.fn()
  const addObject = vi.fn((obj: fabric.Object) => {
    fabricCanvas.add(obj)
  })
  const removeObject = vi.fn((obj: fabric.Object) => {
    fabricCanvas.remove(obj)
  })
  return {
    addObject,
    removeObject,
    fabricCanvas,
    canvasEl: canvasElement,
    containerEl: document.createElement('div'),
    addSequentialTask: vi.fn(async (task: () => void) => task()),
    claimObjectSequence: vi.fn(() => 4),
    taskQueue: {} as any,
    ...overrides,
  } as Context
}

describe('FabricText', () => {
  beforeEach(() => {
    getFabricMock().reset()
  })

  it('creates text objects and reflects updates', async () => {
    const ctx = createTextContext()
    const updateSpy = vi.fn()

    const wrapper = mountComponent(FabricText, {
      props: {
        'modelValue': {
          text: 'Hello',
          fontSize: 32,
          fill: '#000',
        },
        'preset': 'headline',
        'boundKeys': ['text', 'fontSize', 'left'],
        'onUpdate:modelValue': updateSpy,
      },
      provide: [[ContextKey, ctx]],
    })

    await nextTick()
    await flushTextTasks()
    const [[textObj]] = ctx.addObject.mock.calls as [[fabric.FabricText, number | undefined, number | undefined][]]
    expect(textObj).toBeInstanceOf(fabric.FabricText)
    expect(ctx.addSequentialTask).toHaveBeenCalled()

    await flushTextTasks()
    textObj.emit('modified')
    expect(updateSpy).toHaveBeenCalled()

    await wrapper.updateProps({
      modelValue: {
        text: 'Updated',
        fontSize: undefined,
        left: 120,
      },
    })

    await flushTextTasks()
    expect(ctx.fabricCanvas?.renderAll).toHaveBeenCalled()
    wrapper.unmount()
    expect(ctx.removeObject).toHaveBeenCalledWith(textObj)
  })
})
