import type { PropType } from 'vue'
import type { AddSequentialTaskOptions, Context, SequentialTask } from './types'
import * as fabric from 'fabric'
import PQueue from 'p-queue'
import {
  computed,
  defineComponent,
  getCurrentInstance,
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

function isDevEnvironment(): boolean {
  try {
    const meta = import.meta as ImportMeta & { env?: { DEV?: boolean } }
    return Boolean(meta.env?.DEV)
  }
  catch {
    return false
  }
}

export type FabricCanvasOptions = Partial<fabric.CanvasOptions>
const DEFAULT_PIXEL_RATIO = 1

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

export function getSystemPixelRatio() {
  if (typeof window === 'undefined') {
    return DEFAULT_PIXEL_RATIO
  }
  return Math.max(window.devicePixelRatio || DEFAULT_PIXEL_RATIO, DEFAULT_PIXEL_RATIO)
}

function resolvePixelRatio(value?: number) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(value, DEFAULT_PIXEL_RATIO)
  }
  return DEFAULT_PIXEL_RATIO
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
  const resolvedRatio = options?.pixelRatio ?? getSystemPixelRatio()
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
      default: DEFAULT_PIXEL_RATIO,
    },
  },
  emits: ['update:canvasOptions', 'ready'],
  setup(props, { slots, emit }) {
    const instance = getCurrentInstance()
    const canvasOptions = useModel(props, 'canvasOptions')
    const resolvedPixelRatio = computed(() => {
      return resolvePixelRatio(props.pixelRatio)
    })

    const taskQueue = new PQueue({ concurrency: 1, autoStart: false })
    let queueStartScheduled = false
    const ctx = shallowReactive<Partial<Context>>({
      taskQueue,
    })

    const objectMeta = new WeakMap<fabric.Object, { priority?: number, sequence: number }>()
    let nextSequenceId = 0

    function ensureQueueStart() {
      if (queueStartScheduled) {
        return
      }
      queueStartScheduled = true
      Promise.resolve().then(() => {
        queueStartScheduled = false
        ctx.taskQueue?.start()
      })
    }

    function reorderObjects() {
      if (!ctx.fabricCanvas) {
        return
      }
      const objects = ctx.fabricCanvas.getObjects()
      const decorated = objects.map((obj, index) => {
        const meta = objectMeta.get(obj)
        return {
          obj,
          priority: meta?.priority ?? 0,
          sequence: meta?.sequence ?? index,
        }
      })

      decorated
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority
          }
          return a.sequence - b.sequence
        })
        .forEach(({ obj }, index) => {
          const moveFn = (
            // Fabric v6 renamed `moveTo` to `moveObjectTo`; prefer the new API when present.
            (ctx.fabricCanvas as any)?.moveObjectTo
            ?? (ctx.fabricCanvas as any)?.moveTo
          ) as ((target: fabric.Object, position: number) => void) | undefined
          moveFn?.call(ctx.fabricCanvas, obj, index)
        })

      ctx.fabricCanvas.requestRenderAll()
    }

    function addObject(obj: fabric.Object, priority?: number) {
      objectMeta.set(obj, {
        priority,
        sequence: nextSequenceId++,
      })
      ctx.fabricCanvas?.add(obj)
      reorderObjects()
    }

    function removeObject(obj: fabric.Object) {
      ctx.fabricCanvas?.remove(obj)
      objectMeta.delete(obj)
    }

    function runTaskImmediately(task: SequentialTask) {
      return Promise.resolve().then(() => task())
    }

    async function addSequentialTask(task: SequentialTask, options?: AddSequentialTaskOptions) {
      if (!ctx.taskQueue || options?.bypassQueue) {
        return runTaskImmediately(task)
      }

      const queuePriority = options?.priority !== undefined ? -options.priority : undefined
      const queueOptions = queuePriority !== undefined
        ? { priority: queuePriority }
        : undefined

      const queuedTask = ctx.taskQueue.add(() => task(), queueOptions)
      ensureQueueStart()
      return queuedTask
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

    function resolveElements() {
      const root = instance?.proxy?.$el as HTMLDivElement | undefined
      if (!root) {
        return { container: undefined, canvas: undefined }
      }
      const canvas = root.querySelector('canvas') as HTMLCanvasElement | null
      return {
        container: root,
        canvas: canvas ?? undefined,
      }
    }

    onMounted(() => {
      if (isDevEnvironment()) {
        // eslint-disable-next-line no-console
        console.debug('[FabricCanvas] mounted in REPL preview')
      }
      const { container, canvas } = resolveElements()
      ctx.containerEl = container
      ctx.canvasEl = canvas
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
      return h('div', [
        h('canvas'),
        ctx.fabricCanvas ? (slots.default ? slots.default() : null) : null,
      ])
    }
  },
})
