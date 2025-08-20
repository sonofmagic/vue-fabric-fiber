import type { Context } from './types'
import PQueue from 'p-queue'
import { defineComponent, inject, provide, shallowReactive } from 'vue'
import { ContextKey } from './symbols'

// 设置渲染优先级
export const RenderGroup = defineComponent({
  name: 'RenderGroup',
  setup(_, { slots }) {
    const taskQueue = new PQueue({ concurrency: 1 })
    const injectCtx = inject(ContextKey)
    const ctx = shallowReactive({
      ...injectCtx,
      taskQueue,
    })
    provide(ContextKey, ctx as Context)
    return () => {
      return ctx?.fabricCanvas ? (slots.default ? slots.default() : null) : null
    }
  },
})
