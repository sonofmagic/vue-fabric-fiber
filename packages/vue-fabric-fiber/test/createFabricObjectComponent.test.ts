import type { FabricObject } from 'fabric'
import type PQueue from 'p-queue'
import type { Context } from '../lib/types'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createFabricObjectComponent } from '../lib/createFabricObject'
import { ContextKey } from '../lib/symbols'
import { mountComponent } from './test-utils'

type StubFabricObject = FabricObject & {
  trigger: (event: string) => void
  set: (next: Record<string, unknown>) => void
  canvas: { requestRenderAll: ReturnType<typeof vi.fn> }
}

function createStubInstance(initial: Record<string, unknown>): StubFabricObject {
  const listeners = new Map<string, Set<() => void>>()

  function on(event: string, handler: () => void) {
    const handlers = listeners.get(event) ?? new Set()
    handlers.add(handler)
    listeners.set(event, handlers)
    return () => handlers.delete(handler)
  }

  const canvas = {
    requestRenderAll: vi.fn(),
  }

  const stub = {
    ...initial,
    canvas,
    on,
    set: vi.fn((next: Record<string, unknown>) => {
      Object.assign(stub, next)
      canvas.requestRenderAll()
    }),
    trigger(event: string) {
      const handlers = listeners.get(event)
      handlers?.forEach(handler => handler.call(stub))
    },
  } as unknown as StubFabricObject

  return stub
}

function createMockContext(overrides: Partial<Context> = {}): Context {
  const addObject = vi.fn()
  const removeObject = vi.fn()
  const addSequentialTask = vi.fn(async (task: () => unknown) => {
    return task()
  })
  let nextSequenceId = 0

  return {
    addObject,
    removeObject,
    addSequentialTask,
    claimObjectSequence: () => nextSequenceId++,
    taskQueue: {} as PQueue,
    canvasEl: undefined,
    containerEl: undefined,
    ...overrides,
  }
}

describe('createFabricObjectComponent', () => {
  it('queues addition and removal of instances through the context', async () => {
    const instance = createStubInstance({ width: 100 })
    const createInstance = vi.fn(() => instance)
    const mockCtx = createMockContext()

    const TestObject = createFabricObjectComponent({
      name: 'Stub',
      defaults: () => ({ width: 50, height: 40 }),
      createInstance,
    })

    const wrapper = mountComponent(TestObject, {
      props: {
        modelValue: { width: 80 },
      },
      provide: [[ContextKey, mockCtx]],
    })

    await nextTick()
    expect(createInstance).toHaveBeenCalledWith({ width: 80, height: 40 })
    expect(mockCtx.addSequentialTask).toHaveBeenCalledTimes(1)
    expect(mockCtx.addObject).toHaveBeenCalledWith(instance, undefined, 0)

    wrapper.unmount()
    expect(mockCtx.removeObject).toHaveBeenCalledWith(instance)
  })

  it('applies sanitized updates when props change', async () => {
    const instance = createStubInstance({ width: 10 })
    const createInstance = vi.fn(() => instance)
    const applyProps = vi.fn()
    const mockCtx = createMockContext()

    const TestObject = createFabricObjectComponent({
      name: 'Stub',
      defaults: () => ({ width: 5, height: 5, fill: '#000' }),
      createInstance,
      applyProps,
    })

    const wrapper = mountComponent(TestObject, {
      props: {
        modelValue: { width: 20, fill: undefined },
      },
      provide: [[ContextKey, mockCtx]],
    })

    await nextTick()
    expect(applyProps).not.toHaveBeenCalled()

    await wrapper.updateProps({ modelValue: { width: 30, height: undefined, fill: '#fff' } })
    expect(applyProps).toHaveBeenCalledWith(instance, { width: 30, fill: '#fff' })
  })

  it('uses instance.set when no custom applyProps handler is provided', async () => {
    const instance = createStubInstance({ width: 10 })
    const createInstance = vi.fn(() => instance)
    const mockCtx = createMockContext({
      addSequentialTask: undefined as unknown as Context['addSequentialTask'],
    })

    const TestObject = createFabricObjectComponent({
      name: 'StubSetFallback',
      defaults: () => ({ width: 5, height: 5 }),
      createInstance,
    })

    const wrapper = mountComponent(TestObject, {
      props: {
        modelValue: { width: 12 },
      },
      provide: [[ContextKey, mockCtx]],
    })

    await nextTick()
    await wrapper.updateProps({ modelValue: { width: 18, height: undefined } })
    expect(instance.set).toHaveBeenCalledWith({ width: 18 })
    expect(instance.canvas.requestRenderAll).toHaveBeenCalled()
    expect(mockCtx.addObject).toHaveBeenCalledWith(instance, undefined, 0)
  })

  it('emits sanitized model values when the fabric instance mutates', async () => {
    const instance = createStubInstance({ left: 10, top: 20, width: 50 })
    const createInstance = vi.fn(() => instance)
    const mockCtx = createMockContext()
    const updateSpy = vi.fn()

    const TestObject = createFabricObjectComponent({
      name: 'Stub',
      defaults: () => ({ left: 0, top: 0, width: 0 }),
      createInstance,
    })

    const eventProp = 'onUpdate:modelValue'
    mountComponent(TestObject, {
      props: {
        modelValue: { left: 5 },
        [eventProp]: updateSpy,
      },
      provide: [[ContextKey, mockCtx]],
    })

    await nextTick()

    instance.left = 120
    delete (instance as unknown as Record<string, unknown>).top
    instance.trigger('modified')

    expect(updateSpy).toHaveBeenCalledWith({ left: 120 })
  })

  it('skips setup when the factory returns no instance', async () => {
    const createInstance = vi.fn(() => undefined as unknown as FabricObject)
    const mockCtx = createMockContext()

    const TestObject = createFabricObjectComponent({
      name: 'Empty',
      defaults: () => ({ width: 1 }),
      createInstance,
    })

    const wrapper = mountComponent(TestObject, {
      props: {
        modelValue: { width: 5 },
      },
      provide: [[ContextKey, mockCtx]],
    })

    await nextTick()
    expect(mockCtx.addObject).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
