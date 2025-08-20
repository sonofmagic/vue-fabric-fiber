import type { PropType } from 'vue'
import * as fabric from 'fabric'
import { defineComponent, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { ContextKey } from './symbols'

export interface FabricTextProps {

}

export const FabricText = defineComponent({
  name: 'FabricText',
  props: {
    modelValue: {
      type: Object as PropType<fabric.Text>,
      required: true,
    },
    left: {
      type: Number as PropType<number>,
      default: 0,
    },
    top: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: '',
    },
    fontFamily: {
      type: String,
      default: 'Arial',
    },
    fontSize: {
      type: Number,
      default: 16,
    },
    fill: {
      type: String,
      default: '#000',
    },
  },
  // emits: {
  //   'update:modelValue': (value: fabric.Text) => undefined,
  // },
  setup(props) {
    // const modelValue = useModel(props, 'modelValue')
    // emit('update:modelValue', 'x')
    const ctx = inject(ContextKey)

    let textObj: fabric.Text

    onMounted(() => {
      // console.log('FabricText mounted')
      textObj = new fabric.FabricText(props.content, {
        left: props.left,
        top: props.top,
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        fill: props.fill,
      })
      // textObj.on('moving', (e) => {
      //   console.log('moving')
      // })
      ctx?.addSequentialTask(() => {
        ctx?.addObject?.(textObj)
      })
    })

    watch(
      () => ({ ...props }),
      (newProps) => {
        if (textObj) {
          textObj.set({
            left: newProps.left,
            top: newProps.top,
            text: newProps.content,
            fontFamily: newProps.fontFamily,
            fontSize: newProps.fontSize,
            fill: newProps.fill,
          })
          textObj.canvas?.renderAll()
        }
      },
      { deep: true },
    )

    onBeforeUnmount(() => {
      if (textObj) {
        ctx?.removeObject?.(textObj)
      }
    })

    return () => null // 不渲染任何 DOM
  },
})
