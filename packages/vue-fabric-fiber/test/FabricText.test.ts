import type { Context } from '../lib/types'
import type { FabricMockModule } from './mocks/fabric'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
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

const getFabricMock = () => fabricMockState.getAccessor()()
const UPDATE_MODEL_VALUE_EVENT = 'onUpdate:modelValue' as const
type FabricTextModule = typeof import('../lib/FabricText')

let FabricText: FabricTextModule['FabricText']

beforeAll(async () => {
  const mod = await import('../lib/FabricText')
  FabricText = mod.FabricText
})

async function flushTextTasks() {
  await Promise.resolve()
  await Promise.resolve()
}

function createTextContext(overrides: Partial<Context> = {}) {
  const mockFabric: FabricMockModule = getFabricMock()
  const canvasElement = document.createElement('canvas')
  const fabricCanvas = new mockFabric.Canvas(canvasElement, { width: 500, height: 300 })
  const renderAllSpy = vi.spyOn(fabricCanvas, 'renderAll')
  const addObject = vi.fn((obj: InstanceType<FabricMockModule['Object']>) => {
    fabricCanvas.add(obj)
  })
  const removeObject = vi.fn((obj: InstanceType<FabricMockModule['Object']>) => {
    fabricCanvas.remove(obj)
  })
  return {
    addObject,
    removeObject,
    fabricCanvas,
    renderAllSpy,
    canvasEl: canvasElement,
    containerEl: document.createElement('div'),
    addSequentialTask: vi.fn(async (task: () => void) => task()),
    claimObjectSequence: vi.fn(() => 4),
    taskQueue: {} as any,
    ...overrides,
  } as Context & {
    addObject: typeof addObject
    removeObject: typeof removeObject
    fabricCanvas: InstanceType<FabricMockModule['Canvas']>
    renderAllSpy: typeof renderAllSpy
  }
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
        modelValue: {
          text: 'Hello',
          fontSize: 32,
          fill: '#000',
        },
        preset: 'headline',
        boundKeys: ['text', 'fontSize', 'left'],
        [UPDATE_MODEL_VALUE_EVENT]: updateSpy,
      },
      provide: [[ContextKey, ctx]],
    })

    await nextTick()
    await flushTextTasks()
    const mockFabric: FabricMockModule = getFabricMock()
    const [firstCall] = ctx.addObject.mock.calls
    const textObj = firstCall?.[0] as InstanceType<FabricMockModule['FabricText']> | undefined
    expect(textObj).toBeInstanceOf(mockFabric.FabricText)
    expect(ctx.addSequentialTask).toHaveBeenCalled()

    await flushTextTasks()
    textObj!.emit('modified')
    expect(updateSpy).toHaveBeenCalled()

    await wrapper.updateProps({
      modelValue: {
        text: 'Updated',
        fontSize: undefined,
        left: 120,
      },
    })

    await flushTextTasks()
    expect(ctx.renderAllSpy).toHaveBeenCalled()
    wrapper.unmount()
    expect(ctx.removeObject).toHaveBeenCalledWith(textObj)
  })
})
