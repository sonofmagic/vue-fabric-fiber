import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useThemeMode() {
  const themeMode = ref<'light' | 'dark'>('dark')

  const syncThemeMode = () => {
    if (typeof window === 'undefined') {
      return
    }
    const mode = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
    themeMode.value = mode
  }

  let themeObserver: MutationObserver | null = null

  onMounted(() => {
    syncThemeMode()
    themeObserver = new MutationObserver(syncThemeMode)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  })

  onBeforeUnmount(() => {
    themeObserver?.disconnect()
    themeObserver = null
  })

  return {
    themeMode,
    syncThemeMode,
  }
}
