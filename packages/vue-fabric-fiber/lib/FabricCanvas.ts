import type { PropType } from 'vue'
import type { AddSequentialTaskOptions, Context, SequentialTask } from './types'
import * as fabric from 'fabric'
import PQueue from 'p-queue'
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowReactive,
  useModel,
  watch,
} from 'vue'
import { ContextKey } from './symbols'
import { removeUndefined } from './utils'

export type FabricCanvasOptions = Partial<fabric.CanvasOptions>

export type FabricCanvasOptionKey = keyof FabricCanvasOptions

export const FABRIC_CANVAS_OPTION_KEYS = [
  'backgroundColor',
  'preserveObjectStacking',
  'selection',
  'selectionColor',
  'selectionBorderColor',
  'selectionDashArray',
  'selectionLineWidth',
  'selectionFullyContained',
  'perPixelTargetFind',
  'targetFindTolerance',
  'skipTargetFind',
  'controlsAboveOverlay',
  'fireRightClick',
  'fireMiddleClick',
  'stopContextMenu',
  'allowTouchScrolling',
  'imageSmoothingEnabled',
  'renderOnAddRemove',
  'hoverCursor',
  'moveCursor',
  'defaultCursor',
  'freeDrawingCursor',
] as const satisfies readonly FabricCanvasOptionKey[]

export interface FabricCanvasPresetConfig {
  label: string
  options?: FabricCanvasOptions
}

export const FABRIC_CANVAS_PRESETS = {
  default: {
    label: 'Default canvas',
    options: {
      preserveObjectStacking: true,
      selection: true,
      imageSmoothingEnabled: true,
    },
  },
  presentation: {
    label: 'Presentation board',
    options: {
      preserveObjectStacking: true,
      selection: false,
      controlsAboveOverlay: true,
      imageSmoothingEnabled: true,
      backgroundColor: '#020617',
    },
  },
  storyboard: {
    label: 'Storyboard',
    options: {
      preserveObjectStacking: true,
      selection: true,
      selectionDashArray: [6, 4],
      selectionColor: 'rgba(56,189,248,0.15)',
      selectionBorderColor: '#38bdf8',
      selectionLineWidth: 1.5,
      targetFindTolerance: 8,
    },
  },
} as const satisfies Record<string, FabricCanvasPresetConfig>

export type FabricCanvasPresetId = keyof typeof FABRIC_CANVAS_PRESETS

function extractCanvasOptions(source?: FabricCanvasOptions) {
  if (!source) {
    return {}
  }

  return removeUndefined(source)
}

function getDevicePixelRatio(explicit?: number) {
  if (typeof explicit === 'number' && Number.isFinite(explicit)) {
    return Math.max(explicit, 1)
  }
  if (typeof window === 'undefined') {
    return 1
  }
  return Math.max(window.devicePixelRatio || 1, 1)
}

interface SyncResolutionOptions {
  render?: boolean
  pixelRatio?: number
}

function syncCanvasResolution(
  canvas: fabric.Canvas,
  width: number,
  height: number,
  options?: SyncResolutionOptions,
) {
  const resolvedRatio = options?.pixelRatio ?? getDevicePixelRatio()
  const ratio = canvas.enableRetinaScaling === false ? 1 : resolvedRatio
  const targetWidth = Math.max(Math.round(width), 1)
  const targetHeight = Math.max(Math.round(height), 1)

  if (ratio !== 1) {
    canvas.setDimensions(
      {
        width: Math.round(targetWidth * ratio),
        height: Math.round(targetHeight * ratio),
      },
      { backstoreOnly: true },
    )
    canvas.setDimensions(
      {
        width: targetWidth,
        height: targetHeight,
      },
      { cssOnly: true },
    )
  }
  else {
    canvas.setDimensions({
      width: targetWidth,
      height: targetHeight,
    })
  }

  canvas.calcOffset?.()
  if (options?.render !== false) {
    canvas.requestRenderAll()
  }
}

function applyCanvasOptions(canvas: fabric.Canvas, options: FabricCanvasOptions, pixelRatio: number) {
  const {
    width,
    height,
    backgroundColor,
    ...rest
  } = options

  if (width !== undefined || height !== undefined) {
    const nextWidth = width ?? canvas.getWidth()
    const nextHeight = height ?? canvas.getHeight()
    syncCanvasResolution(canvas, nextWidth, nextHeight, { render: false, pixelRatio })
  }

  if (backgroundColor !== undefined) {
    canvas.set('backgroundColor', backgroundColor as string)
  }

  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined) {
      continue
    }

    if (key in canvas) {
      ;(canvas as unknown as Record<string, unknown>)[key] = value
    }
  }

  canvas.requestRenderAll()
}

export const FabricCanvas = defineComponent({
  name: 'FabricCanvas',
  props: {
    canvasOptions: {
      type: Object as PropType<FabricCanvasOptions>,
      default: () => ({}),
    },
    preset: {
      type: String as PropType<FabricCanvasPresetId>,
      default: 'default',
    },
    initial: {
      type: Object as PropType<FabricCanvasOptions>,
      default: () => ({}),
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    pixelRatio: {
      type: Number,
      default: undefined,
    },
  },
  emits: ['update:canvasOptions', 'ready'],
  setup(props, { slots, emit }) {
    const canvasOptions = useModel(props, 'canvasOptions')
    const resolvedPixelRatio = computed(() => {
      return getDevicePixelRatio(props.pixelRatio)
    })

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

    function runTaskImmediately(task: SequentialTask) {
      return Promise.resolve().then(() => task())
    }

    async function addSequentialTask(task: SequentialTask, options?: AddSequentialTaskOptions) {
      if (!ctx.taskQueue || options?.bypassQueue) {
        return runTaskImmediately(task)
      }

      const queueOptions = options?.priority !== undefined
        ? { priority: options.priority }
        : undefined

      return ctx.taskQueue.add(() => task(), queueOptions)
    }

    ctx.addObject = addObject
    ctx.removeObject = removeObject
    ctx.addSequentialTask = addSequentialTask

    const presetConfig = computed<FabricCanvasPresetConfig>(() => {
      return FABRIC_CANVAS_PRESETS[props.preset] ?? FABRIC_CANVAS_PRESETS.default
    })

    const resolvedOptions = computed(() => {
      return removeUndefined({
        preserveObjectStacking: true,
        selection: true,
        ...extractCanvasOptions(presetConfig.value.options),
        ...extractCanvasOptions(props.initial),
        ...extractCanvasOptions(canvasOptions.value),
      })
    })

    const shouldAutoResize = computed(() => {
      return props.autoResize
        && resolvedOptions.value.width === undefined
        && resolvedOptions.value.height === undefined
    })

    let resizeObserver: ResizeObserver | undefined

    function teardownResizeObserver() {
      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = undefined
      }
    }

    function setupResizeObserver() {
      const container = ctx.containerEl
      const canvas = ctx.fabricCanvas
      if (!container || !canvas || typeof ResizeObserver === 'undefined') {
        return
      }

      teardownResizeObserver()

      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) {
          return
        }
        const { width, height } = entry.contentRect
        syncCanvasResolution(canvas, width, height, { pixelRatio: resolvedPixelRatio.value })
      })
      resizeObserver.observe(container)
    }

    onMounted(() => {
      if (!ctx.canvasEl || !ctx.containerEl) {
        return
      }

      const containerWidth = ctx.containerEl.clientWidth || 720
      const containerHeight = ctx.containerEl.clientHeight || 480

      const { width, height, ...rest } = resolvedOptions.value

      ctx.fabricCanvas = new fabric.Canvas(ctx.canvasEl, {
        width: width ?? containerWidth,
        height: height ?? containerHeight,
        ...rest,
      })

      syncCanvasResolution(
        ctx.fabricCanvas,
        width ?? containerWidth,
        height ?? containerHeight,
        { render: false, pixelRatio: resolvedPixelRatio.value },
      )

      applyCanvasOptions(ctx.fabricCanvas, resolvedOptions.value, resolvedPixelRatio.value)

      if (shouldAutoResize.value) {
        setupResizeObserver()
      }

      emit('ready', ctx.fabricCanvas)
    })

    watch(
      resolvedOptions,
      (next) => {
        if (!ctx.fabricCanvas) {
          return
        }
        applyCanvasOptions(ctx.fabricCanvas, next, resolvedPixelRatio.value)
      },
      { deep: true },
    )

    watch(resolvedPixelRatio, (ratio) => {
      if (!ctx.fabricCanvas) {
        return
      }
      syncCanvasResolution(ctx.fabricCanvas, ctx.fabricCanvas.getWidth(), ctx.fabricCanvas.getHeight(), {
        pixelRatio: ratio,
      })
    })

    watch(shouldAutoResize, (enabled) => {
      if (!ctx.fabricCanvas) {
        return
      }
      if (enabled) {
        setupResizeObserver()
      }
      else {
        teardownResizeObserver()
      }
    })

    onBeforeUnmount(() => {
      teardownResizeObserver()
      ctx.fabricCanvas?.dispose()
      ctx.fabricCanvas = undefined
    })

    provide(ContextKey, ctx as Context)

    return () => {
      return h(
        'div',
        {
          ref: (el) => {
            ctx.containerEl = el as HTMLDivElement | undefined
          },
        },
        [
          h('canvas', {
            ref: (el) => {
              ctx.canvasEl = el as HTMLCanvasElement | undefined
            },
          }),
          ctx.fabricCanvas ? (slots.default ? slots.default() : null) : null,
        ],
      )
    }
  },
})
