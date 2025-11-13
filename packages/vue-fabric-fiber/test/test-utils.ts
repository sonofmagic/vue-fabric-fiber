import type { Component, InjectionKey } from 'vue'
import { createApp, defineComponent, h, nextTick, provide, reactive } from 'vue'

interface MountOptions {
  props?: Record<string, unknown>
  provide?: Array<[InjectionKey<any> | symbol | string, any]>
  slots?: Record<string, () => unknown>
}

export function mountComponent(component: Component, options: MountOptions = {}) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const slotRenderers = options.slots ?? {}

  const host = defineComponent({
    setup(_, { expose }) {
      const state = reactive({ ...(options.props ?? {}) })

      if (options.provide) {
        for (const [key, value] of options.provide) {
          provide(key as InjectionKey<any>, value)
        }
      }

      expose({
        setProps: (next: Record<string, unknown>) => {
          Object.assign(state, next)
        },
      })

      return () => h(component as Component, state, slotRenderers)
    },
  })

  const app = createApp(host)
  const vm = app.mount(container) as unknown as { setProps: (next: Record<string, unknown>) => void }

  return {
    async updateProps(next: Record<string, unknown>) {
      vm.setProps(next)
      await nextTick()
    },
    unmount() {
      app.unmount()
      container.remove()
    },
  }
}
