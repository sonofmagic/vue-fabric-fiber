import type { AddSequentialTaskOptions, Context, SequentialTask } from '../lib/types'
import PQueue from 'p-queue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, inject, nextTick, onMounted } from 'vue'
import { RenderGroup } from '../lib/RenderGroup'
import { ContextKey } from '../lib/symbols'
import { mountComponent } from './test-utils'

function createSequenceClaimer() {
  let next = 0
  return () => next++
}

function createParentContext(overrides: Partial<Context> = {}) {
  const recordedCalls: Array<[SequentialTask, AddSequentialTaskOptions | undefined]> = []

  const addSequentialTask: Context['addSequentialTask'] = async (task, options) => {
    recordedCalls.push([task, options])
    await task()
    return undefined
  }

  const addObject = vi.fn<Context['addObject']>()

  const ctx: Context = {
    addObject,
    removeObject: vi.fn(),
    addSequentialTask,
    claimObjectSequence: createSequenceClaimer(),
    taskQueue: {} as PQueue,
    fabricCanvas: undefined,
    canvasEl: undefined,
    containerEl: undefined,
    ...overrides,
  }

  return { ctx, recordedCalls }
}

function createQueuedParentContext() {
  const queue = new PQueue({ concurrency: 1 })

  const ctx: Context = {
    addObject: vi.fn(),
    removeObject: vi.fn(),
    addSequentialTask(task, options) {
      const queuePriority = options?.priority !== undefined ? -options.priority : undefined
      const queueOptions = queuePriority !== undefined ? { priority: queuePriority } : undefined
      return queue.add(async () => {
        await task()
      }, queueOptions)
    },
    claimObjectSequence: createSequenceClaimer(),
    taskQueue: queue,
    fabricCanvas: undefined,
    canvasEl: undefined,
    containerEl: undefined,
  }

  return { ctx, queue }
}

function createConsumer(trackers: number[]) {
  return defineComponent({
    name: 'TaskConsumer',
    setup() {
      const ctx = inject<Context | undefined>(ContextKey, undefined)
      onMounted(() => {
        if (!ctx?.addSequentialTask) {
          return
        }
        const queuedTaskRunner = ctx.addSequentialTask as unknown as (
          task: SequentialTask,
          options?: AddSequentialTaskOptions,
        ) => Promise<unknown>
        queuedTaskRunner(() => {
          trackers.push(1)
        })
      })
      return () => null
    },
  })
}

function createValueConsumer(trackers: number[], value: number) {
  return defineComponent({
    name: `TaskConsumer${value}`,
    setup() {
      const ctx = inject<Context | undefined>(ContextKey, undefined)
      onMounted(() => {
        ctx?.addSequentialTask?.(() => {
          trackers.push(value)
        })
      })
      return () => null
    },
  })
}

function createAddObjectConsumer(value: number) {
  return defineComponent({
    name: `AddObjectConsumer${value}`,
    setup() {
      const ctx = inject<Context | undefined>(ContextKey, undefined)
      onMounted(() => {
        ctx?.addObject?.({} as never)
      })
      return () => null
    },
  })
}

describe('RenderGroup', () => {
  it('forwards priority to the parent queue', async () => {
    const { ctx: parentCtx, recordedCalls } = createParentContext()
    const taskTracker: number[] = []
    const Consumer = createConsumer(taskTracker)

    mountComponent(RenderGroup, {
      props: { priority: 7 },
      provide: [[ContextKey, parentCtx]],
      slots: {
        default: () => [h(Consumer)],
      },
    })

    await nextTick()
    expect(recordedCalls).toHaveLength(1)
    const firstCall = recordedCalls[0]
    const [, options] = firstCall!
    expect(options).toEqual({ priority: 7 })
    expect(taskTracker).toHaveLength(1)
  })

  it('allows per-call options to override the priority and bypass queue', async () => {
    const { ctx: parentCtx, recordedCalls } = createParentContext()
    const logs: number[] = []

    const Consumer = defineComponent({
      name: 'OverrideConsumer',
      setup() {
        const ctx = inject<Context | undefined>(ContextKey, undefined)
        onMounted(() => {
          ctx?.addSequentialTask?.(() => {
            logs.push(1)
          }, { priority: 3, bypassQueue: true })
        })
        return () => null
      },
    })

    mountComponent(RenderGroup, {
      props: { priority: 1 },
      provide: [[ContextKey, parentCtx]],
      slots: {
        default: () => [h(Consumer)],
      },
    })

    await nextTick()
    expect(recordedCalls).toHaveLength(1)
    const [, options] = recordedCalls[0]!
    expect(options).toEqual({ priority: 3, bypassQueue: true })
    expect(logs).toEqual([1])
  })

  it('bypasses the queue when disableQueue is set', async () => {
    const { ctx: parentCtx, recordedCalls } = createParentContext()
    const taskTracker: number[] = []
    const Consumer = createConsumer(taskTracker)

    mountComponent(RenderGroup, {
      props: { disableQueue: true },
      provide: [[ContextKey, parentCtx]],
      slots: {
        default: () => [h(Consumer)],
      },
    })

    await nextTick()
    expect(recordedCalls).toHaveLength(1)
    const firstCall = recordedCalls[0]
    const [, options] = firstCall!
    expect(options).toEqual({ bypassQueue: true })
    expect(taskTracker).toHaveLength(1)
  })

  it('forwards priority when adding objects via addObject', async () => {
    const { ctx: parentCtx } = createParentContext()
    const Consumer = createAddObjectConsumer(1)

    mountComponent(RenderGroup, {
      props: { priority: 9 },
      provide: [[ContextKey, parentCtx]],
      slots: {
        default: () => [h(Consumer)],
      },
    })

    await nextTick()
    expect(parentCtx.addObject).toHaveBeenCalledTimes(1)
    expect(parentCtx.addObject).toHaveBeenCalledWith(expect.anything(), 9, undefined)
  })

  it('runs tasks immediately when no parent context exists', async () => {
    const trackers: number[] = []
    const Consumer = createConsumer(trackers)

    mountComponent(RenderGroup, {
      slots: {
        default: () => [h(Consumer)],
      },
    })

    await nextTick()
    expect(trackers).toEqual([1])
  })

  it('runs higher priority groups after lower ones to preserve stacking order', async () => {
    const { ctx: parentCtx, queue } = createQueuedParentContext()
    const taskTracker: number[] = []

    const Consumer0 = createValueConsumer(taskTracker, 0)
    const Consumer1 = createValueConsumer(taskTracker, 1)
    const Consumer2 = createValueConsumer(taskTracker, 2)
    const Consumer3 = createValueConsumer(taskTracker, 3)

    const Host = defineComponent({
      name: 'RenderGroupPriorityHost',
      setup() {
        return () => [
          h(RenderGroup, { priority: 0 }, { default: () => [h(Consumer0)] }),
          h(RenderGroup, { priority: 1 }, { default: () => [h(Consumer1)] }),
          h(RenderGroup, { priority: 2 }, { default: () => [h(Consumer2)] }),
          h(RenderGroup, { priority: 3 }, { default: () => [h(Consumer3)] }),
        ]
      },
    })

    mountComponent(Host, {
      provide: [[ContextKey, parentCtx]],
    })

    await nextTick()
    await queue.onIdle()

    expect(taskTracker).toEqual([0, 1, 2, 3])
  })
})
