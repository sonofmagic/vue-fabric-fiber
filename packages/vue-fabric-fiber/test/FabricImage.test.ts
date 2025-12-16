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
type FabricImageModule = typeof import('../lib/FabricImage')
let FabricImage: FabricImageModule['FabricImage']

beforeAll(async () => {
  const mod = await import('../lib/FabricImage')
  FabricImage = mod.FabricImage
})

async function flushImageTasks() {
  await Promise.resolve()
  await Promise.resolve()
}

function createImageContext(overrides: Partial<Context> = {}) {
  const mockFabric: FabricMockModule = getFabricMock()
  const canvasElement = document.createElement('canvas')
  canvasElement.width = 600
  canvasElement.height = 400
  const fabricCanvas = new mockFabric.Canvas(canvasElement, { width: 600, height: 400 })
  const addObject = vi.fn<(obj: InstanceType<FabricMockModule['FabricImage']>, priority?: number, sequence?: number) => void>()
  const removeObject = vi.fn<(obj: InstanceType<FabricMockModule['FabricImage']>) => void>()
  return {
    addObject,
    removeObject,
    fabricCanvas,
    canvasEl: canvasElement,
    containerEl: document.createElement('div'),
    addSequentialTask: vi.fn(async (task: () => unknown) => task()),
    claimObjectSequence: vi.fn(() => 11),
    taskQueue: {} as any,
    ...overrides,
  } as Context & {
    addObject: typeof addObject
    removeObject: typeof removeObject
    fabricCanvas: InstanceType<FabricMockModule['Canvas']>
  }
}

describe('FabricImage', () => {
  beforeEach(() => {
    getFabricMock().reset()
    getFabricMock().FabricImage.failureSources.clear()
  })

  it('loads images, applies bindings and reacts to prop changes', async () => {
    const ctx = createImageContext()
    const updateSpy = vi.fn()

    const wrapper = mountComponent(FabricImage, {
      props: {
        modelValue: {
          src: 'mock-src',
          width: '50%',
          height: '100%',
          crossOrigin: 'anonymous',
          selectable: true,
        },
        stackOrder: 9,
        [UPDATE_MODEL_VALUE_EVENT]: updateSpy,
      },
      provide: [[ContextKey, ctx]],
    })

    await nextTick()
    await flushImageTasks()
    const mockFabric: FabricMockModule = getFabricMock()
    const [firstCall] = ctx.addObject.mock.calls
    const imageInstance = firstCall?.[0] as InstanceType<FabricMockModule['FabricImage']> | undefined
    expect(imageInstance).toBeInstanceOf(mockFabric.FabricImage)
    const image = imageInstance!
    expect(ctx.addObject).toHaveBeenCalledWith(image, undefined, 9)
    expect(image.scaleX).toBeGreaterThan(0)
    expect(image.scaleY).toBeGreaterThan(0)

    await flushImageTasks()
    image.emit('modified')
    expect(updateSpy).toHaveBeenCalled()

    await wrapper.updateProps({
      modelValue: {
        src: 'mock-src',
        width: 120,
        height: undefined,
        left: 80,
      },
    })
    await flushImageTasks()
    expect(ctx.fabricCanvas.renderCount).toBeGreaterThan(0)

    getFabricMock().FabricImage.failureSources.add('broken')
    await wrapper.updateProps({
      modelValue: {
        src: 'broken',
      },
    })
    expect(ctx.fabricCanvas.events.at(-1)).toMatchObject({ event: 'fabric:image-error' })

    await wrapper.updateProps({
      modelValue: {
        src: '',
      },
    })
    await nextTick()
    expect(ctx.removeObject).toHaveBeenCalledWith(image)

    wrapper.unmount()
  })

  it('aborts pending loads when the source changes quickly', async () => {
    const ctx = createImageContext()
    let slowReject: (() => void) | undefined

    const mockFabric: FabricMockModule = getFabricMock()
    const loadSpy = vi.spyOn(mockFabric.FabricImage, 'fromURL').mockImplementation((src: string, loadOptions: { signal?: AbortSignal } = {}) => {
      if (src === 'slow') {
        return new Promise((_resolve, reject) => {
          slowReject = () => reject(new DOMException('Aborted', 'AbortError'))
          loadOptions.signal?.addEventListener('abort', () => slowReject?.())
        })
      }
      return Promise.resolve(new mockFabric.FabricImage({ src }))
    })

    const wrapper = mountComponent(FabricImage, {
      props: {
        modelValue: {
          src: 'slow',
        },
      },
      provide: [[ContextKey, ctx]],
    })

    await nextTick()
    await wrapper.updateProps({
      modelValue: {
        src: 'replacement',
      },
    })
    await nextTick()

    expect(loadSpy).toHaveBeenCalledTimes(2)
    wrapper.unmount()
    loadSpy.mockRestore()
  })
})
