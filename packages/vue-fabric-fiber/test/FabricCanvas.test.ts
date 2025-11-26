import type { Context } from '../lib/types'
import * as fabric from 'fabric'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick, onMounted } from 'vue'
import { FabricCanvas, getSystemPixelRatio } from '../lib/FabricCanvas'
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

vi.mock('p-queue', () => {
  class MockQueue {
    onIdlePromise: Promise<void> = Promise.resolve()

    add(task: () => Promise<void> | void) {
      const result = Promise.resolve().then(() => task())
      this.onIdlePromise = result.then(() => undefined)
      return result
    }

    start() {}

    onIdle() {
      return this.onIdlePromise
    }
  }
  return { default: MockQueue }
})

const getFabricMock = () => fabricMockState.getAccessor()()

async function flushTasks() {
  await Promise.resolve()
  await Promise.resolve()
}

class MockResizeObserver implements ResizeObserver {
  observed: Element | null = null
  disconnected = false
  constructor(private readonly callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this)
  }

  static instances: MockResizeObserver[] = []

  observe(target: Element) {
    this.observed = target
  }

  unobserve() {}

  disconnect() {
    this.disconnected = true
  }

  trigger(width: number, height: number) {
    this.callback(
      [
        {
          contentRect: { width, height },
        } as ResizeObserverEntry,
      ],
      this as never,
    )
  }
}

describe('FabricCanvas', () => {
  beforeEach(() => {
    getFabricMock().reset()
    MockResizeObserver.instances = []
    ;(globalThis as any).ResizeObserver = MockResizeObserver
  })

  afterEach(() => {
    delete (globalThis as any).ResizeObserver
  })

  it('mounts a fabric canvas and manages sequential tasks', async () => {
    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const readySpy = vi.fn()
    const taskLog: string[] = []
    const bypassSpy = vi.fn()
    const ctxRef: { value?: Context } = {}

    const Consumer = defineComponent({
      name: 'CanvasConsumer',
      setup() {
        const ctx = inject(ContextKey)
        onMounted(() => {
          ctxRef.value = ctx as Context
        })
        return () => null
      },
    })

    const wrapper = mountComponent(FabricCanvas, {
      props: {
        pixelRatio: 2,
        canvasOptions: { hoverCursor: 'grab' },
        preset: 'default',
        onReady: readySpy,
      },
      slots: {
        default: () => [h(Consumer)],
      },
    })

    await nextTick()
    await flushTasks()
    const canvasInstance = getFabricMock().Canvas.instances[0]
    expect(readySpy).toHaveBeenCalledWith(canvasInstance)
    expect(canvasInstance.renderCount).toBeGreaterThan(0)
    const ctx = ctxRef.value!
    await ctx.addSequentialTask?.(() => {
      taskLog.push('queued')
    })
    await ctx.addSequentialTask?.(() => {
      taskLog.push('override')
    }, { priority: 5 })
    await ctx.addSequentialTask?.(() => {
      bypassSpy('bypass')
    }, { bypassQueue: true })
    await ctx.taskQueue?.onIdle?.()

    const objA = new fabric.Circle({ id: 'first' })
    const objB = new fabric.Circle({ id: 'second' })
    const seq0 = ctx.claimObjectSequence?.() ?? 0
    const seq1 = ctx.claimObjectSequence?.() ?? 0
    ctx.addObject?.(objB, undefined, seq0)
    ctx.addObject?.(objA, 2, seq1)
    ctx.removeObject?.(objA)

    expect(taskLog).toEqual(['queued', 'override'])
    expect(bypassSpy).toHaveBeenCalledWith('bypass')
    expect(canvasInstance.getObjects()).toHaveLength(1)
    expect(canvasInstance.dimensionCalls.length).toBeGreaterThanOrEqual(2)

    const initialObserver = MockResizeObserver.instances[0]
    expect(initialObserver.observed).toBeInstanceOf(HTMLElement)
    initialObserver.trigger(420, 300)
    expect(canvasInstance.dimensionCalls.some(call => call.dim.width === 420)).toBe(true)

    await wrapper.updateProps({ canvasOptions: { width: 800, backgroundColor: '#222' } })
    expect(initialObserver.disconnected).toBe(true)
    expect((canvasInstance as any).backgroundColor).toBe('#222')
    expect(canvasInstance.width).toBe(800)

    await wrapper.updateProps({ canvasOptions: {} })
    const nextObserver = MockResizeObserver.instances.at(-1)
    expect(nextObserver?.observed).toBeInstanceOf(HTMLElement)

    canvasInstance.enableRetinaScaling = false
    await wrapper.updateProps({ pixelRatio: 3 })
    canvasInstance.enableRetinaScaling = true
    await wrapper.updateProps({ pixelRatio: 1 })
    await wrapper.updateProps({ autoResize: false })
    await wrapper.updateProps({ autoResize: true })
    await wrapper.updateProps({ pixelRatio: 0 })

    wrapper.unmount()
    expect(canvasInstance.disposed).toBe(true)
    consoleSpy.mockRestore()
  })
})

describe('getSystemPixelRatio', () => {
  it('falls back to the default when window is unavailable', () => {
    const originalWindow = (globalThis as any).window
    ;(globalThis as any).window = undefined
    expect(getSystemPixelRatio()).toBe(1)
    ;(globalThis as any).window = originalWindow
  })

  it('returns the device pixel ratio when present', () => {
    const originalWindow = (globalThis as any).window
    ;(globalThis as any).window = { devicePixelRatio: 2.5 }
    expect(getSystemPixelRatio()).toBe(2.5)
    ;(globalThis as any).window = originalWindow
  })
})
