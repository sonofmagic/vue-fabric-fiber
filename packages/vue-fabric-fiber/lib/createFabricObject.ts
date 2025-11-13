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

type ModelRecord = Record<string, any>

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
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const propsWithModel = props as unknown as { modelValue: TModel }

      const model = computed<TModel>({
        get: () => propsWithModel.modelValue,
        set: value => emit('update:modelValue', value),
      })
      const ctx = inject(ContextKey)

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

        disposers.push(
          instance.on('modified', () => {
            if (!instance) {
              return
            }
            const payload = removeUndefined(
              Object.fromEntries(
                observedKeys.value.map((key) => {
                  const value = (instance as unknown as Record<string, unknown>)[key]
                  return [key, value]
                }),
              ),
            ) as TModel
            emit('update:modelValue', payload)
          }),
        )

        if (ctx?.addSequentialTask) {
          ctx.addSequentialTask(() => {
            ctx.addObject?.(instance!)
          })
        }
        else {
          ctx?.addObject?.(instance)
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
