import type { TextProps } from 'fabric'
import type { PropType } from 'vue'
import { pick } from 'es-toolkit'
import * as fabric from 'fabric'
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  useModel,
  watch,
} from 'vue'
import { ContextKey } from './symbols'
import { removeUndefined } from './utils'

export interface FabricTextModelValue extends Partial<Omit<TextProps, 'selectionBackgroundColor' | 'originX' | 'originY' | 'cornerStyle'>> {
  text: string
}

function keyReduce(newProps: FabricTextModelValue): FabricTextModelValue {
  const item = removeUndefined({
    left: newProps.left,
    top: newProps.top,
    text: newProps.text,
    fontFamily: newProps.fontFamily,
    fontSize: newProps.fontSize,
    fill: newProps.fill,
    absolutePositioned: newProps.absolutePositioned,
    fontWeight: newProps.fontWeight,
    fontStyle: newProps.fontStyle,
    textAlign: newProps.textAlign,
    lineHeight: newProps.lineHeight,
    activeOn: newProps.activeOn,
    angle: newProps.angle,
    backgroundColor: newProps.backgroundColor,
    borderColor: newProps.borderColor,
    borderDashArray: newProps.borderDashArray,
    borderOpacityWhenMoving: newProps.borderOpacityWhenMoving,
    borderScaleFactor: newProps.borderScaleFactor,
    clipPath: newProps.clipPath,
    centeredRotation: newProps.centeredRotation,
    cornerColor: newProps.cornerColor,
    cornerDashArray: newProps.cornerDashArray,
    cornerSize: newProps.cornerSize,
    cornerStrokeColor: newProps.cornerStrokeColor,
    centeredScaling: newProps.centeredScaling,
    charSpacing: newProps.charSpacing,
    direction: newProps.direction,
    evented: newProps.evented,
    excludeFromExport: newProps.excludeFromExport,
    fillRule: newProps.fillRule,
    flipX: newProps.flipX,
    flipY: newProps.flipY,
    globalCompositeOperation: newProps.globalCompositeOperation,
    hasBorders: newProps.hasBorders,
    hasControls: newProps.hasControls,
    height: newProps.height,
    hoverCursor: newProps.hoverCursor,
    includeDefaultValues: newProps.includeDefaultValues,
    inverted: newProps.inverted,
    linethrough: newProps.linethrough,
    lockMovementX: newProps.lockMovementX,
    lockMovementY: newProps.lockMovementY,
    lockRotation: newProps.lockRotation,
    lockScalingFlip: newProps.lockScalingFlip,
    lockScalingX: newProps.lockScalingX,
    lockScalingY: newProps.lockScalingY,
    lockSkewingX: newProps.lockSkewingX,
    lockSkewingY: newProps.lockSkewingY,
    minScaleLimit: newProps.minScaleLimit,
    moveCursor: newProps.moveCursor,
    objectCaching: newProps.objectCaching,
    opacity: newProps.opacity,
    overline: newProps.overline,
    padding: newProps.padding,
    paintFirst: newProps.paintFirst,
    pathAlign: newProps.pathAlign,
    pathSide: newProps.pathSide,
    perPixelTargetFind: newProps.perPixelTargetFind,
    scaleX: newProps.scaleX,
    scaleY: newProps.scaleY,
    selectable: newProps.selectable,
    shadow: newProps.shadow,
    stroke: newProps.stroke,
    strokeDashArray: newProps.strokeDashArray,
    strokeDashOffset: newProps.strokeDashOffset,
    strokeLineCap: newProps.strokeLineCap,
    strokeLineJoin: newProps.strokeLineJoin,
    skewX: newProps.skewX,
    skewY: newProps.skewY,
    strokeUniform: newProps.strokeUniform,
    strokeWidth: newProps.strokeWidth,
    width: newProps.width,
    strokeMiterLimit: newProps.strokeMiterLimit,
    styles: newProps.styles,
    textDecorationThickness: newProps.textDecorationThickness,
    touchCornerSize: newProps.touchCornerSize,
    transparentCorners: newProps.transparentCorners,
    underline: newProps.underline,
    visible: newProps.visible,
    canvas: newProps.canvas,
    noScaleCache: newProps.noScaleCache,
    path: newProps.path,
    snapAngle: newProps.snapAngle,
    snapThreshold: newProps.snapThreshold,
  })
  // console.log(item)
  return item
}

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
    const selectedKeys = computed(() => {
      return Object.keys(modelValue.value)
    })
    onMounted(() => {
      textObj = new fabric.FabricText(modelValue.value.text, modelValue.value)

      disposerCollection.push(
        textObj.on('modified', (e) => {
          const target = e.target as fabric.FabricText
          emit('update:modelValue', keyReduce(
            pick(
              target,
              selectedKeys.value as (keyof FabricTextModelValue)[],
            ),
          ))
        }),
      )

      ctx?.addSequentialTask(() => {
        ctx?.addObject?.(textObj)
      })
    })

    watch(
      modelValue,
      (newProps) => {
        if (textObj) {
          textObj.set(
            keyReduce(newProps),
          )
          textObj.canvas?.renderAll()
        }
      },
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
