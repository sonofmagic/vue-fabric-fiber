import type PQueue from 'p-queue'
import type { AddSequentialTaskOptions, Context, SequentialTask } from '../lib/types'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, inject, nextTick, onMounted } from 'vue'
import { RenderGroup } from '../lib/RenderGroup'
import { ContextKey } from '../lib/symbols'
import { mountComponent } from './test-utils'

function createParentContext(overrides: Partial<Context> = {}) {
  const recordedCalls: Array<[SequentialTask, AddSequentialTaskOptions | undefined]> = []

  const addSequentialTask: Context['addSequentialTask'] = async (task, options) => {
    recordedCalls.push([task, options])
    await task()
    return undefined
  }

  const ctx: Context = {
    addObject: vi.fn(),
    removeObject: vi.fn(),
    addSequentialTask,
    taskQueue: {} as PQueue,
    fabricCanvas: undefined,
    canvasEl: undefined,
    containerEl: undefined,
    ...overrides,
  }

  return { ctx, recordedCalls }
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
})
