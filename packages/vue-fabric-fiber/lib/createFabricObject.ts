import type { FabricObject } from 'fabric'
import type { PropType } from 'vue'
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  watch,
} from 'vue'
import { ContextKey } from './symbols'
import { removeUndefined } from './utils'

type ModelRecord = Record<string, unknown>
export type FabricObjectSyncEvent = 'modified' | 'moving' | 'scaling' | 'rotating'
export const DEFAULT_SYNC_EVENTS: readonly FabricObjectSyncEvent[] = ['modified', 'moving', 'scaling', 'rotating']

interface FabricObjectComponentProps<TModel extends ModelRecord> {
  modelValue: TModel
  syncOn: FabricObjectSyncEvent[]
  stackOrder?: number
}

export function bindFabricSyncEvents<TModel extends ModelRecord, TObject extends FabricObject>(
  instance: TObject,
  events: readonly FabricObjectSyncEvent[],
  snapshot: (source: TObject) => TModel,
  emit: (payload: TModel) => void,
) {
  const disposers: VoidFunction[] = []
  events.forEach((eventName) => {
    const disposer = instance.on(eventName as never, () => {
      emit(snapshot(instance))
    })
    if (typeof disposer === 'function') {
      disposers.push(disposer)
    }
  })
  return disposers
}

export interface CreateFabricObjectComponentOptions<
  TModel extends ModelRecord,
  TObject extends FabricObject,
> {
  name: string
  defaults?: () => Partial<TModel>
  createInstance: (initial: TModel) => TObject
  applyProps?: (instance: TObject, next: TModel) => void
}

export function createFabricObjectComponent<
  TModel extends ModelRecord,
  TObject extends FabricObject,
>(
  options: CreateFabricObjectComponentOptions<TModel, TObject>,
): ReturnType<typeof defineComponent> {
  return defineComponent({
    name: options.name,
    props: {
      modelValue: {
        type: Object as PropType<TModel>,
        default: () => {
          return {
            ...(options.defaults ? options.defaults() : {}),
          } as TModel
        },
      },
      /**
       * Fabric events that should push updated props back through v-model.
       */
      syncOn: {
        type: Array as PropType<FabricObjectSyncEvent[]>,
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
    setup(
      props: Readonly<FabricObjectComponentProps<TModel>>,
      { emit },
    ) {
      const model = computed<TModel>({
        get: () => props.modelValue,
        set: value => emit('update:modelValue', value),
      })
      const ctx = inject(ContextKey)
      const sequenceHint = props.stackOrder ?? ctx?.claimObjectSequence?.()

      let instance: TObject | undefined
      const disposers: VoidFunction[] = []

      const resolvedModel = computed<TModel>(() => {
        return {
          ...(options.defaults ? options.defaults() : {}),
          ...model.value,
        } as TModel
      })
      const boundModel = computed<TModel>(() => {
        return removeUndefined(model.value) as TModel
      })
      const observedKeys = computed(() => {
        return Object.keys(boundModel.value) as (keyof TModel & string)[]
      })

      const resolvedSyncEvents = computed<readonly FabricObjectSyncEvent[]>(() => {
        const base = Array.isArray(props.syncOn) && props.syncOn.length > 0 ? props.syncOn : DEFAULT_SYNC_EVENTS
        return Array.from(new Set(base))
      })

      function emitModelSnapshot(source: TObject) {
        const payload = removeUndefined(
          Object.fromEntries(
            observedKeys.value.map((key) => {
              const value = (source as unknown as Record<string, unknown>)[key]
              return [key, value]
            }),
          ),
        ) as TModel
        return payload
      }

      function applyToInstance(next: TModel) {
        if (!instance) {
          return
        }
        const sanitized = removeUndefined(next) as TModel
        if (options.applyProps) {
          options.applyProps(instance, sanitized)
        }
        else {
          instance.set(sanitized as unknown as Record<string, unknown>)
        }
        instance.canvas?.requestRenderAll()
      }

      onMounted(() => {
        const initial = removeUndefined(resolvedModel.value)
        instance = options.createInstance(initial)

        if (!instance) {
          return
        }

        const eventDisposers = bindFabricSyncEvents(
          instance,
          resolvedSyncEvents.value,
          () => emitModelSnapshot(instance!),
          payload => emit('update:modelValue', payload),
        )
        disposers.push(...eventDisposers)

        if (ctx?.addSequentialTask) {
          ctx.addSequentialTask(() => {
            ctx.addObject?.(instance!, undefined, sequenceHint)
          })
        }
        else {
          ctx?.addObject?.(instance, undefined, sequenceHint)
        }
      })

      watch(
        resolvedModel,
        (next) => {
          applyToInstance(next)
        },
        { deep: true },
      )

      onBeforeUnmount(() => {
        if (instance) {
          ctx?.removeObject?.(instance)
        }
        disposers.forEach(dispose => dispose())
        disposers.length = 0
        instance = undefined
      })

      return () => null
    },
  })
}
