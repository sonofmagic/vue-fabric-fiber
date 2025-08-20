import * as fabric from 'fabric'
import { defineComponent, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { ContextKey } from './symbols'

export const FabricImage = defineComponent({
  name: 'FabricImage',
  props: {
    src: { type: String, required: true },
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    width: { type: [Number, String], default: undefined },
    height: { type: [Number, String], default: undefined },
    hasControls: { type: Boolean, default: true },
    selectable: { type: Boolean, default: true },
  },
  setup(props) {
    const ctx = inject(ContextKey)

    let imgObj: fabric.Image

    async function loadImage() {
      if (!props.src) {
        return
      }
      const img = await fabric.FabricImage.fromURL(
        props.src,
        {

        },
        {
          selectable: props.selectable,
          hasControls: props.hasControls,
        },
      )
      img.set({
        left: props.left,
        top: props.top,
      })

      if (props.width) {
        if (props.width === '100%') {
          img.width = ctx?.canvasEl?.width || 0
        }
        else {
          img.scaleToWidth(Number(props.width))
        }
      }
      if (props.height) {
        if (props.height === '100%') {
          img.height = ctx?.canvasEl?.height || 0
        }
        else {
          img.scaleToHeight(Number(props.height))
        }
      }
      if (imgObj) {
        ctx?.removeObject?.(imgObj)
      }
      imgObj = img
      ctx?.addObject?.(imgObj)
    }

    onMounted(() => {
      // console.log('FabricImage mounted')
      ctx?.addSequentialTask(() => {
        return loadImage()
      })
    })
    watch(() => props.src, loadImage)

    onBeforeUnmount(() => {
      if (imgObj) {
        ctx?.removeObject?.(imgObj)
      }
    })

    return () => null
  },
})
