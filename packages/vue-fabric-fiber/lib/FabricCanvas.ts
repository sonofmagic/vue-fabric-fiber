import type { Context } from './types'
import * as fabric from 'fabric'
import PQueue from 'p-queue'
import { defineComponent, h, onBeforeUnmount, onMounted, provide, shallowReactive } from 'vue'
import { ContextKey } from './symbols'

export const FabricCanvas = defineComponent({
  name: 'FabricCanvas',
  setup(_, { slots }) {
    const taskQueue = new PQueue({ concurrency: 1 })
    const ctx = shallowReactive<Partial<Context>>({
      taskQueue,
    })

    function addObject(obj: fabric.Object) {
      return ctx.fabricCanvas?.add(obj)
    }
    function removeObject(obj: fabric.Object) {
      ctx.fabricCanvas?.remove(obj)
    }

    async function addSequentialTask(task: () => Promise<void> | void) {
      const targetTask = taskQueue.add(() => {
        return task()
      })
      return targetTask
    }

    ctx.addSequentialTask = addSequentialTask
    ctx.addObject = addObject
    ctx.removeObject = removeObject

    onMounted(() => {
      if (ctx.canvasEl && ctx.containerEl) {
        ctx.fabricCanvas = new fabric.Canvas(ctx.canvasEl, {
          width: ctx.containerEl.clientWidth,
          height: ctx.containerEl.clientHeight,
        })

        // 监听对象正在被拖动
        // fabricCanvas.value.on('object:moving', (e) => {

        // })
        // fabricCanvas.value.on('object:modified', (e) => {

        // })
      }
    })

    onBeforeUnmount(() => {
      ctx.fabricCanvas?.dispose()
      ctx.fabricCanvas = undefined
    })

    provide(ContextKey, ctx as Context)

    return () => {
      return h(
        'div',
        {
          ref: (el) => {
            ctx.containerEl = el as HTMLDivElement
          },
        },
        [
          h('canvas', {
            ref: (el) => {
              ctx.canvasEl = el as HTMLCanvasElement
            },
          }),
          // slots.default ? slots.default() : null,
          ctx.fabricCanvas ? (slots.default ? slots.default() : null) : null,
        ],
      )
    }
  },
})
