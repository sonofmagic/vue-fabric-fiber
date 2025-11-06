import type { ImageProps, TCrossOrigin } from 'fabric'
import type { PropType } from 'vue'
import type { Context } from './types'
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
import { normalizeKeySelection, pickDefinedOptions, pickFromUnknown } from './binding-helpers'
import { ContextKey } from './symbols'

type ExcludedImagePropKeys
  = | 'clipPath'
    | 'canvas'
    | 'path'
    | 'styles'
    | 'src'

type BaseImageProps = Omit<ImageProps, ExcludedImagePropKeys>

type FabricImageOptionalProps = Partial<
  Omit<BaseImageProps, 'width' | 'height' | 'filters'>
> & {
  filters?: unknown[]
}

export interface FabricImageModelValue extends FabricImageOptionalProps {
  src: string
  /**
   * Desired rendered width. Numbers are treated as pixel values.
   * Percentages are resolved against the canvas; e.g. `"100%"` fills the canvas width.
   */
  width?: number | string
  /**
   * Desired rendered height. Numbers are treated as pixel values.
   * Percentages are resolved against the canvas; e.g. `"100%"` fills the canvas height.
   */
  height?: number | string
  crossOrigin?: TCrossOrigin
}

export type FabricImageOptionKey = keyof FabricImageOptionalProps

export const FABRIC_IMAGE_OPTION_KEYS = [
  'left',
  'top',
  'angle',
  'scaleX',
  'scaleY',
  'opacity',
  'selectable',
  'hasControls',
  'visible',
  'evented',
  'hoverCursor',
  'moveCursor',
  'flipX',
  'flipY',
  'skewX',
  'skewY',
  'stroke',
  'strokeWidth',
  'strokeDashArray',
  'strokeDashOffset',
  'strokeLineCap',
  'strokeLineJoin',
  'strokeUniform',
  'strokeMiterLimit',
  'shadow',
  'padding',
  'perPixelTargetFind',
  'borderColor',
  'cornerColor',
  'cornerSize',
  'cornerStrokeColor',
  'cornerDashArray',
  'cornerStyle',
  'borderDashArray',
  'borderOpacityWhenMoving',
  'borderScaleFactor',
  'transparentCorners',
  'centeredScaling',
  'centeredRotation',
  'lockMovementX',
  'lockMovementY',
  'lockScalingX',
  'lockScalingY',
  'lockScalingFlip',
  'lockRotation',
  'lockSkewingX',
  'lockSkewingY',
  'includeDefaultValues',
  'excludeFromExport',
  'objectCaching',
  'absolutePositioned',
  'cropX',
  'cropY',
  'imageSmoothing',
] as const satisfies readonly FabricImageOptionKey[]

export const FABRIC_IMAGE_BINDABLE_KEYS = [
  'src',
  'left',
  'top',
  'angle',
  'scaleX',
  'scaleY',
  'opacity',
  'selectable',
  'hasControls',
  'flipX',
  'flipY',
  'cropX',
  'cropY',
  'shadow',
  'width',
  'height',
  'crossOrigin',
] as const

export type FabricImageBindableKey = typeof FABRIC_IMAGE_BINDABLE_KEYS[number]

const FABRIC_IMAGE_BINDABLE_KEY_SET = new Set<FabricImageBindableKey>(FABRIC_IMAGE_BINDABLE_KEYS)

export interface FabricImagePresetConfig {
  label: string
  boundKeys?: readonly FabricImageBindableKey[]
  initial?: Partial<FabricImageModelValue>
}

const DEFAULT_BOUND_KEYS: readonly FabricImageBindableKey[] = [
  'src',
  'left',
  'top',
  'scaleX',
  'scaleY',
  'angle',
  'opacity',
  'selectable',
  'hasControls',
  'width',
  'height',
] as const

export const FABRIC_IMAGE_PRESETS = {
  default: {
    label: 'Default image',
    boundKeys: DEFAULT_BOUND_KEYS,
    initial: {
      selectable: true,
      hasControls: true,
      opacity: 1,
    },
  },
  background: {
    label: 'Background image',
    boundKeys: [
      'src',
      'width',
      'height',
      'opacity',
    ],
    initial: {
      selectable: false,
      hasControls: false,
      opacity: 1,
    },
  },
  overlay: {
    label: 'Overlay image',
    boundKeys: [
      'src',
      'left',
      'top',
      'scaleX',
      'scaleY',
      'angle',
      'opacity',
      'selectable',
      'hasControls',
      'width',
      'height',
    ],
    initial: {
      selectable: true,
      hasControls: true,
      opacity: 0.9,
    },
  },
} as const satisfies Record<string, FabricImagePresetConfig>

export type FabricImagePresetId = keyof typeof FABRIC_IMAGE_PRESETS

const DEFAULT_PRESET_ID: FabricImagePresetId = 'default'

function resolveDimensionValue(
  value: number | string | undefined,
  canvasSize: number | undefined,
  current: number,
) {
  if (value === undefined) {
    return undefined
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return undefined
    }

    if (trimmed === 'auto') {
      return undefined
    }

    if (trimmed === '100%' && canvasSize !== undefined) {
      return canvasSize
    }

    const numeric = Number.parseFloat(trimmed)
    if (Number.isNaN(numeric)) {
      return undefined
    }

    if (trimmed.endsWith('%')) {
      if (canvasSize !== undefined) {
        return canvasSize * (numeric / 100)
      }
      return current * (numeric / 100)
    }

    return numeric
  }

  return undefined
}

function applyDimensionProps(
  instance: fabric.FabricImage,
  value: FabricImageModelValue,
  canvasWidth?: number,
  canvasHeight?: number,
) {
  const currentWidth = instance.getScaledWidth()
  const currentHeight = instance.getScaledHeight()

  const resolvedWidth = resolveDimensionValue(
    value.width,
    canvasWidth,
    currentWidth,
  )
  const resolvedHeight = resolveDimensionValue(
    value.height,
    canvasHeight,
    currentHeight,
  )

  let changed = false

  if (resolvedWidth !== undefined && Number.isFinite(resolvedWidth)) {
    instance.scaleToWidth(resolvedWidth)
    changed = true
  }

  if (resolvedHeight !== undefined && Number.isFinite(resolvedHeight)) {
    instance.scaleToHeight(resolvedHeight)
    changed = true
  }

  if (changed) {
    instance.setCoords()
  }
}

function getCanvasDimensions(ctx?: Context) {
  const width = ctx?.fabricCanvas?.getWidth() ?? ctx?.canvasEl?.width
  const height = ctx?.fabricCanvas?.getHeight() ?? ctx?.canvasEl?.height
  return { width, height }
}

export const FabricImage = defineComponent({
  name: 'FabricImage',
  props: {
    modelValue: {
      type: Object as PropType<FabricImageModelValue>,
      required: true,
    },
    preset: {
      type: String as PropType<FabricImagePresetId>,
      default: DEFAULT_PRESET_ID,
    },
    initial: {
      type: Object as PropType<Partial<FabricImageModelValue>>,
      default: () => {
        return {}
      },
    },
    boundKeys: {
      type: Array as PropType<FabricImageBindableKey[]>,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const modelValue = useModel(props, 'modelValue')

    const ctx = inject(ContextKey)

    let imageObj: fabric.FabricImage | undefined
    let activeAbortController: AbortController | undefined

    const presetConfig = computed<FabricImagePresetConfig>(() => {
      return FABRIC_IMAGE_PRESETS[props.preset] ?? FABRIC_IMAGE_PRESETS[DEFAULT_PRESET_ID]
    })

    const resolvedInitialProps = computed<Partial<FabricImageModelValue>>(() => {
      return {
        ...(pickDefinedOptions(presetConfig.value.initial, FABRIC_IMAGE_OPTION_KEYS) as Partial<FabricImageModelValue>),
        ...(pickDefinedOptions(props.initial, FABRIC_IMAGE_OPTION_KEYS) as Partial<FabricImageModelValue>),
      }
    })

    const resolvedBoundKeys = computed<readonly FabricImageBindableKey[]>(() => {
      const base
        = (props.boundKeys?.length ? props.boundKeys : undefined)
          ?? (presetConfig.value.boundKeys?.length ? presetConfig.value.boundKeys : undefined)
          ?? DEFAULT_BOUND_KEYS

      const normalized = normalizeKeySelection(base, FABRIC_IMAGE_BINDABLE_KEY_SET)
      const keys = new Set<FabricImageBindableKey>(normalized)

      normalizeKeySelection(Object.keys(modelValue.value), FABRIC_IMAGE_BINDABLE_KEY_SET).forEach(key => keys.add(key))
      keys.add('src')

      return Array.from(keys)
    })

    const disposerCollection: VoidFunction[] = []

    function cleanupImage() {
      if (imageObj) {
        ctx?.removeObject?.(imageObj)
      }
      disposerCollection.forEach(disposer => disposer())
      disposerCollection.length = 0
      imageObj = undefined
    }

    function abortPendingLoad() {
      if (activeAbortController) {
        activeAbortController.abort()
        activeAbortController = undefined
      }
    }

    function attachEventListeners(instance: fabric.FabricImage) {
      disposerCollection.push(
        instance.on('modified', (event) => {
          const target = event.target as fabric.FabricImage | undefined
          if (!target) {
            return
          }

          const next = pickFromUnknown(target, resolvedBoundKeys.value) as Partial<FabricImageModelValue>

          if (resolvedBoundKeys.value.includes('src')) {
            next.src = target.getSrc()
          }

          if (resolvedBoundKeys.value.includes('crossOrigin')) {
            next.crossOrigin = target.getCrossOrigin() as TCrossOrigin
          }

          if (resolvedBoundKeys.value.includes('width')) {
            next.width = target.getScaledWidth()
          }

          if (resolvedBoundKeys.value.includes('height')) {
            next.height = target.getScaledHeight()
          }

          emit('update:modelValue', {
            ...modelValue.value,
            ...next,
          } as FabricImageModelValue)
        }),
      )
    }

    async function instantiateImage(value: FabricImageModelValue) {
      if (!value?.src) {
        return
      }

      abortPendingLoad()
      cleanupImage()

      activeAbortController = new AbortController()

      const optionPayload = {
        ...resolvedInitialProps.value,
        ...(pickDefinedOptions(value, FABRIC_IMAGE_OPTION_KEYS) as Partial<FabricImageModelValue>),
      }

      const resolvedCrossOrigin = (
        value.crossOrigin
        ?? props.initial?.crossOrigin
        ?? presetConfig.value.initial?.crossOrigin
      ) as TCrossOrigin | undefined

      const loadOptions = {
        crossOrigin: resolvedCrossOrigin ?? undefined,
        signal: activeAbortController.signal,
      }

      try {
        const instance = await fabric.FabricImage.fromURL(
          value.src,
          loadOptions,
          optionPayload as Partial<ImageProps>,
        )

        instance.set(optionPayload as Record<string, unknown>)

        const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(ctx)
        applyDimensionProps(instance, value, canvasWidth, canvasHeight)

        attachEventListeners(instance)

        ctx?.addObject?.(instance)
        imageObj = instance
        ctx?.fabricCanvas?.requestRenderAll?.()
      }
      catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        console.error('[FabricImage] Failed to load image', error)
      }
    }

    onMounted(() => {
      ctx?.addSequentialTask?.(() => instantiateImage(modelValue.value))
    })

    watch(
      modelValue,
      (newValue, oldValue) => {
        if (!imageObj) {
          return
        }

        if (
          newValue.src !== oldValue?.src
          || newValue.crossOrigin !== oldValue?.crossOrigin
        ) {
          ctx?.addSequentialTask?.(() => instantiateImage(newValue))
          return
        }

        const nextOptions = pickDefinedOptions(newValue, resolvedBoundKeys.value) as Partial<FabricImageModelValue>

        delete nextOptions.src

        if (Object.keys(nextOptions).length > 0) {
          imageObj.set(nextOptions as Record<string, unknown>)
        }

        const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(ctx)
        applyDimensionProps(imageObj, newValue, canvasWidth, canvasHeight)

        imageObj.canvas?.requestRenderAll?.()
      },
      { deep: true },
    )

    onBeforeUnmount(() => {
      abortPendingLoad()
      cleanupImage()
    })

    return () => null
  },
})
