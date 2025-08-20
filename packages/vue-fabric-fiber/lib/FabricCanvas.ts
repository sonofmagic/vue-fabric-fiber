import * as fabric from 'fabric'
import { defineComponent, h, onBeforeUnmount, onMounted, provide, shallowRef } from 'vue'

export const FabricCanvas = defineComponent({
  name: 'FabricCanvas',
  setup(_, { slots }) {
    const canvasElRef = shallowRef<HTMLCanvasElement>()
    const fabricCanvas = shallowRef<fabric.Canvas>()
    const containerElRef = shallowRef<HTMLDivElement>()

    function addObject(obj: fabric.Object) {
      fabricCanvas.value?.add(obj)
    }
    function removeObject(obj: fabric.Object) {
      fabricCanvas.value?.remove(obj)
    }

    onMounted(() => {
      if (canvasElRef.value && containerElRef.value) {
        fabricCanvas.value = new fabric.Canvas(canvasElRef.value, {
          width: containerElRef.value.clientWidth,
          height: containerElRef.value.clientHeight,
        })
      }
    })

    onBeforeUnmount(() => {
      fabricCanvas.value?.dispose()
    })

    provide('fabricAddObject', addObject)
    provide('fabricRemoveObject', removeObject)

    return () => {
      return h(
        'div',
        { ref: containerElRef },
        [
          h('canvas', { ref: canvasElRef }),
          // slots.default ? slots.default() : null,
          fabricCanvas.value ? (slots.default ? slots.default() : null) : null,
        ],
      )
    }
  },
})
