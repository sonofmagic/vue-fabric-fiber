import type { PropType } from 'vue'
import * as fabric from 'fabric'
import { defineComponent, inject, onBeforeUnmount, onMounted, useModel, watch } from 'vue'
import { ContextKey } from './symbols'

export interface FabricTextModelValue {
  text: string
  left?: number
  top?: number
  fontSize?: number
  fontFamily?: string
  fill?: string
}

// export interface FabricTextProps {

// }

export const FabricText = defineComponent({
  name: 'FabricText',
  props: {
    modelValue: {
      type: Object as PropType<FabricTextModelValue>,
      default: () => {
        return {

        } as FabricTextModelValue
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const modelValue = useModel(props, 'modelValue')

    const ctx = inject(ContextKey)

    let textObj: fabric.Text

    const disposerCollection: VoidFunction[] = []

    onMounted(() => {
      textObj = new fabric.FabricText(modelValue.value.text, {
        left: modelValue.value.left,
        top: modelValue.value.top,
        // fontFamily: modelValue.value.fontFamily,
        fontSize: modelValue.value.fontSize,
        fill: modelValue.value.fill,
      })

      disposerCollection.push(
        textObj.on('modified', (e) => {
          const target = e.target as fabric.FabricText
          emit('update:modelValue', {
            text: target.text,
            fill: target.fill as string,
            left: target.left,
            top: target.top,
            fontSize: target.fontSize,
            // fontFamily: target.fontFamily,
          } satisfies FabricTextModelValue)
        }),
        // textObj.on('moving', (e) => {
        //   console.log(e)
        //   // const target = e.target as fabric.FabricText
        //   // emit('update:modelValue', {
        //   //   text: target.text,
        //   //   fill: target.fill as string,
        //   //   left: target.left,
        //   //   top: target.top,
        //   //   fontSize: target.fontSize,
        //   //   // fontFamily: target.fontFamily,
        //   // } satisfies FabricTextModelValue)
        // }),

      )
      ctx?.addSequentialTask(() => {
        ctx?.addObject?.(textObj)
      })
    })

    watch(
      modelValue,
      (newProps) => {
        if (textObj) {
          textObj.set({
            left: newProps.left,
            top: newProps.top,
            text: newProps.text,
            // fontFamily: newProps.fontFamily,
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

      disposerCollection.forEach(disposer => disposer())
      disposerCollection.length = 0
    })

    return () => null // 不渲染任何 DOM
  },
})
