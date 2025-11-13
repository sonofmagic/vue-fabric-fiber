export type ThemeName = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'fabric-ports-theme'
export const THEME_EVENT_NAME = 'fabric-theme-change'

export function resolveInitialTheme(): ThemeName {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const stored = window.localStorage?.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function readThemeFromDocument(): ThemeName {
  if (typeof document === 'undefined') {
    return 'dark'
  }
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function dispatchThemeChange(theme: ThemeName) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(THEME_EVENT_NAME, {
    detail: { theme },
  }))
}
