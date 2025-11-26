import type { TextProps } from 'fabric'
import type { PropType } from 'vue'
import type { FabricObjectSyncEvent } from './createFabricObject'
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
import { bindFabricSyncEvents, DEFAULT_SYNC_EVENTS } from './createFabricObject'
import { ContextKey } from './symbols'

type ExcludedTextPropKeys
  = | 'selectionBackgroundColor'
    | 'originX'
    | 'originY'
    | 'cornerStyle'
    | 'clipPath'
    | 'canvas'
    | 'path'
    | 'styles'

type BaseTextProps = Omit<TextProps, ExcludedTextPropKeys>

export const FABRIC_TEXT_OPTION_KEYS = [
  'left',
  'top',
  'fontFamily',
  'fontSize',
  'fill',
  'absolutePositioned',
  'fontWeight',
  'fontStyle',
  'textAlign',
  'lineHeight',
  'activeOn',
  'angle',
  'backgroundColor',
  'borderColor',
  'borderDashArray',
  'borderOpacityWhenMoving',
  'borderScaleFactor',
  'centeredRotation',
  'cornerColor',
  'cornerDashArray',
  'cornerSize',
  'cornerStrokeColor',
  'centeredScaling',
  'charSpacing',
  'direction',
  'evented',
  'excludeFromExport',
  'fillRule',
  'flipX',
  'flipY',
  'globalCompositeOperation',
  'hasBorders',
  'hasControls',
  'height',
  'hoverCursor',
  'includeDefaultValues',
  'inverted',
  'linethrough',
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingFlip',
  'lockScalingX',
  'lockScalingY',
  'lockSkewingX',
  'lockSkewingY',
  'minScaleLimit',
  'moveCursor',
  'objectCaching',
  'opacity',
  'overline',
  'padding',
  'paintFirst',
  'pathAlign',
  'pathSide',
  'perPixelTargetFind',
  'scaleX',
  'scaleY',
  'selectable',
  'shadow',
  'stroke',
  'strokeDashArray',
  'strokeDashOffset',
  'strokeLineCap',
  'strokeLineJoin',
  'skewX',
  'skewY',
  'strokeUniform',
  'strokeWidth',
  'width',
  'strokeMiterLimit',
  'textDecorationThickness',
  'touchCornerSize',
  'transparentCorners',
  'underline',
  'visible',
] as const satisfies readonly (keyof BaseTextProps)[]

export type FabricTextOptionKey = typeof FABRIC_TEXT_OPTION_KEYS[number]

export const FABRIC_TEXT_BINDABLE_KEYS = [
  'text',
  ...FABRIC_TEXT_OPTION_KEYS,
] as const

export type FabricTextBindableKey = typeof FABRIC_TEXT_BINDABLE_KEYS[number]

const FABRIC_TEXT_BINDABLE_KEY_SET = new Set<FabricTextBindableKey>(FABRIC_TEXT_BINDABLE_KEYS)

type FabricTextOptionalProps = Partial<Pick<BaseTextProps, FabricTextOptionKey>>

export interface FabricTextModelValue extends FabricTextOptionalProps {
  text: string
  [key: string]: unknown
}

type FabricTextSyncEvent = FabricObjectSyncEvent

export interface FabricTextPresetConfig {
  label: string
  /**
   * Keys that should participate in two-way bindings for this preset.
   * Falls back to a sensible default selection when omitted.
   */
  boundKeys?: readonly FabricTextBindableKey[]
  /**
   * Initial props applied when the FabricText is created.
   * These act as defaults before modelValue overrides.
   */
  initial?: Partial<FabricTextModelValue>
}

const DEFAULT_BOUND_KEYS: readonly FabricTextBindableKey[] = [
  'text',
  'left',
  'top',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'fill',
  'textAlign',
  'lineHeight',
  'scaleX',
  'scaleY',
  'angle',
  'opacity',
  'selectable',
  'shadow',
  'stroke',
  'strokeWidth',
  'width',
  'padding',
  'charSpacing',
] as const

export const FABRIC_TEXT_PRESETS = {
  default: {
    label: 'Default text',
    boundKeys: DEFAULT_BOUND_KEYS,
    initial: {
      fontFamily: 'Inter',
      fill: '#f8fafc',
    },
  },
  headline: {
    label: 'Headline',
    boundKeys: [
      'text',
      'left',
      'top',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fill',
      'lineHeight',
      'textAlign',
      'width',
      'selectable',
    ],
    initial: {
      fontFamily: 'Inter',
      fontWeight: '700',
      fill: '#f1f5f9',
      lineHeight: 1.1,
    },
  },
  badge: {
    label: 'Badge',
    boundKeys: [
      'text',
      'left',
      'top',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fill',
      'padding',
      'selectable',
      'shadow',
    ],
    initial: {
      fontFamily: 'DM Sans',
      fontWeight: '600',
      fill: '#0f172a',
      padding: 8,
      selectable: false,
    },
  },
} as const satisfies Record<string, FabricTextPresetConfig>

export type FabricTextPresetId = keyof typeof FABRIC_TEXT_PRESETS

const DEFAULT_PRESET_ID: FabricTextPresetId = 'default'

export const FabricText = defineComponent({
  name: 'FabricText',
  props: {
    modelValue: {
      type: Object as PropType<FabricTextModelValue>,
      default: () => {
        return {
          text: '',
        } satisfies FabricTextModelValue
      },
    },
    /**
     * Apply a preset to seed initial props and bound keys in bulk.
     */
    preset: {
      type: String as PropType<FabricTextPresetId>,
      default: DEFAULT_PRESET_ID,
    },
    /**
     * Override or extend the initial props defined by the preset.
     */
    initial: {
      type: Object as PropType<Partial<FabricTextModelValue>>,
      default: () => {
        return {}
      },
    },
    /**
     * Fine-tune the set of props that participate in v-model updates.
     * When provided it overrides the preset keys.
     */
    boundKeys: {
      type: Array as PropType<FabricTextBindableKey[]>,
      default: undefined,
    },
    /**
     * Fabric events that should trigger a v-model emit with fresh props.
     * Defaults to drag/scale/rotate + modified.
     */
    syncOn: {
      type: Array as PropType<FabricTextSyncEvent[]>,
      default: () => {
        return [...DEFAULT_SYNC_EVENTS]
      },
    },
    /**
     * Optional stack order hint. Lower numbers render beneath higher ones.
     */
    stackOrder: {
      type: Number,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const modelValue = useModel(props, 'modelValue')

    const ctx = inject(ContextKey)
    const sequenceHint = props.stackOrder ?? ctx?.claimObjectSequence?.()

    let textObj: fabric.Text | undefined

    const presetConfig = computed<FabricTextPresetConfig>(() => {
      return FABRIC_TEXT_PRESETS[props.preset] ?? FABRIC_TEXT_PRESETS[DEFAULT_PRESET_ID]
    })

    const resolvedInitialProps = computed<Partial<FabricTextModelValue>>(() => {
      return {
        ...(pickDefinedOptions(presetConfig.value.initial, FABRIC_TEXT_OPTION_KEYS) as Partial<FabricTextModelValue>),
        ...(pickDefinedOptions(props.initial, FABRIC_TEXT_OPTION_KEYS) as Partial<FabricTextModelValue>),
      }
    })

    const resolvedBoundKeys = computed<readonly FabricTextBindableKey[]>(() => {
      const base
        = (props.boundKeys?.length ? props.boundKeys : undefined)
          ?? (presetConfig.value.boundKeys?.length ? presetConfig.value.boundKeys : undefined)
          ?? DEFAULT_BOUND_KEYS

      const normalizedBase = normalizeKeySelection(base, FABRIC_TEXT_BINDABLE_KEY_SET)
      const keys = new Set<FabricTextBindableKey>(normalizedBase)

      normalizeKeySelection(Object.keys(modelValue.value), FABRIC_TEXT_BINDABLE_KEY_SET).forEach(key => keys.add(key))
      keys.add('text')

      return Array.from(keys)
    })

    const resolvedSyncEvents = computed<readonly FabricTextSyncEvent[]>(() => {
      const normalized = Array.isArray(props.syncOn) && props.syncOn.length > 0
        ? props.syncOn
        : DEFAULT_SYNC_EVENTS
      return Array.from(new Set(normalized))
    })

    function emitModelValueUpdate(source: fabric.FabricText) {
      const next = pickFromUnknown(source, resolvedBoundKeys.value) as Partial<FabricTextModelValue>
      next.text = typeof source.text === 'string' ? source.text : modelValue.value.text

      return {
        ...modelValue.value,
        ...next,
      } as FabricTextModelValue
    }

    const disposerCollection: VoidFunction[] = []

    onMounted(() => {
      const creationOptions = {
        ...resolvedInitialProps.value,
        ...(pickDefinedOptions(modelValue.value, FABRIC_TEXT_OPTION_KEYS) as Partial<FabricTextModelValue>),
      }

      textObj = new fabric.FabricText(
        modelValue.value.text,
        creationOptions as Partial<TextProps>,
      )

      const syncDisposers = bindFabricSyncEvents(
        textObj,
        resolvedSyncEvents.value,
        () => emitModelValueUpdate(textObj!),
        payload => emit('update:modelValue', payload),
      )
      disposerCollection.push(...syncDisposers)

      ctx?.addSequentialTask(() => {
        ctx?.addObject?.(textObj!, undefined, sequenceHint)
      })
    })

    watch(
      modelValue,
      (newValue) => {
        if (!textObj) {
          return
        }

        const payload = pickDefinedOptions(newValue, resolvedBoundKeys.value) as Partial<FabricTextModelValue>

        if (payload.text === undefined) {
          payload.text = newValue.text
        }

        textObj.set(payload as Record<string, unknown>)
        textObj.canvas?.renderAll()
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

    return () => null
  },
})
