import type { Context, SequentialTask } from './types'
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

    function fallbackRun(task: SequentialTask) {
      return Promise.resolve().then(() => task())
    }

    function addSequentialTask(task: SequentialTask) {
      if (!parentAddSequentialTask) {
        return fallbackRun(task)
      }

      if (props.disableQueue) {
        return parentAddSequentialTask(task, { bypassQueue: true })
      }

      const options = props.priority !== undefined
        ? { priority: props.priority }
        : undefined

      return parentAddSequentialTask(task, options)
    }

    ctx.addSequentialTask = addSequentialTask

    provide(ContextKey, ctx as Context)
    return () => {
      return ctx?.fabricCanvas ? (slots.default ? slots.default() : null) : null
    }
  },
})
