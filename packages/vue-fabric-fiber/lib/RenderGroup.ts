import type { AddSequentialTaskOptions, Context, SequentialTask } from './types'
import { defineComponent, inject, provide, shallowReactive } from 'vue'
import { ContextKey } from './symbols'

// 设置渲染优先级
export const RenderGroup = defineComponent({
  name: 'RenderGroup',
  props: {
    priority: {
      type: Number,
      default: undefined,
    },
    disableQueue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const injectCtx = inject<Context | undefined>(ContextKey, undefined)
    const ctx = shallowReactive<Partial<Context>>({
      ...(injectCtx ?? {}),
    })

    const parentAddSequentialTask = injectCtx?.addSequentialTask
    const parentAddObject = injectCtx?.addObject
    const parentClaimObjectSequence = injectCtx?.claimObjectSequence

    function fallbackRun(task: SequentialTask) {
      return Promise.resolve().then(() => task())
    }

    function addSequentialTask(task: SequentialTask, options?: AddSequentialTaskOptions) {
      if (!parentAddSequentialTask) {
        return fallbackRun(task)
      }

      const mergedOptions: AddSequentialTaskOptions = {}

      if (props.priority !== undefined) {
        mergedOptions.priority = props.priority
      }

      if (options?.priority !== undefined) {
        mergedOptions.priority = options.priority
      }

      const bypassQueue = props.disableQueue || options?.bypassQueue === true
      if (bypassQueue) {
        mergedOptions.bypassQueue = true
      }

      const hasOptions = mergedOptions.priority !== undefined || mergedOptions.bypassQueue === true
      return parentAddSequentialTask(task, hasOptions ? mergedOptions : undefined)
    }

    function addObject(
      obj: Parameters<Context['addObject']>[0],
      priority?: number,
      sequence?: number,
    ) {
      return parentAddObject?.(obj, props.priority ?? priority, sequence)
    }

    ctx.addSequentialTask = addSequentialTask
    ctx.addObject = addObject
    ctx.claimObjectSequence = () => parentClaimObjectSequence?.() ?? 0

    provide(ContextKey, ctx as Context)
    return () => slots.default?.() ?? null
  },
})
