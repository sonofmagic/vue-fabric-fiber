import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zh from './locales/zh'

export const SUPPORTED_LOCALES = ['en', 'zh'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

const STORAGE_KEY = 'fabric-ports-locale'

function resolveInitialLocale(): SupportedLocale {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const stored = window.localStorage?.getItem(STORAGE_KEY)
  if (isSupportedLocale(stored)) {
    return stored
  }

  const browserLocales = window.navigator?.languages ?? [window.navigator?.language].filter(Boolean)
  for (const locale of browserLocales) {
    if (!locale) {
      continue
    }
    const normalized = locale.toLowerCase()
    const match = SUPPORTED_LOCALES.find(entry => normalized.startsWith(entry))
    if (match) {
      return match
    }
  }

  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
})

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === 'string' && SUPPORTED_LOCALES.includes(value as SupportedLocale)
}

export function rememberLocale(locale: SupportedLocale) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage?.setItem(STORAGE_KEY, locale)
  }
  catch {
    // no-op
  }
}
