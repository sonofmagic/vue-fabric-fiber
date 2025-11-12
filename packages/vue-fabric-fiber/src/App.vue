<script setup lang="ts">
import type { ThemeName } from '@/constants/theme'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { dispatchThemeChange, resolveInitialTheme, THEME_STORAGE_KEY } from '@/constants/theme'
import { isSupportedLocale, rememberLocale, SUPPORTED_LOCALES } from '@/i18n'
import { usePageSeo } from '@/seo'

const { t, locale } = useI18n()

const navLinks = computed(() => [
  { to: '/', label: t('app.nav.overview') },
  { to: '/docs', label: t('app.nav.docs') },
  { to: '/demos', label: t('app.nav.demos') },
])

const localeOptions = SUPPORTED_LOCALES

const route = useRoute()
const showMobileNav = ref(false)
const year = new Date().getFullYear()
const theme = ref<ThemeName>('dark')
if (typeof window !== 'undefined') {
  theme.value = resolveInitialTheme()
}

function isActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}

function applyTheme(next: ThemeName) {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.dataset.theme = next
  dispatchThemeChange(next)
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function toggleMobileNav() {
  showMobileNav.value = !showMobileNav.value
}

function closeMobileNav() {
  showMobileNav.value = false
}

watch(locale, (next) => {
  if (isSupportedLocale(next)) {
    rememberLocale(next)
  }
})

if (typeof window !== 'undefined') {
  applyTheme(theme.value)
  watch(theme, (next) => {
    applyTheme(next)
    try {
      window.localStorage?.setItem(THEME_STORAGE_KEY, next)
    }
    catch {
      // noop
    }
  })
}

const themeToggleLabel = computed(() => (theme.value === 'dark' ? t('app.actions.lightMode') : t('app.actions.darkMode')))

usePageSeo()
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <div aria-hidden="true" class="pointer-events-none fixed inset-0">
      <div class="absolute inset-0 bg-grid-overlay opacity-50" />
      <div class="absolute -left-32 top-[-12rem] h-[520px] w-[520px] rounded-full bg-cyan-500/12 blur-3xl" />
      <div class="absolute right-[-180px] top-[220px] h-[460px] w-[460px] rounded-full bg-purple-500/10 blur-[140px]" />
      <div class="absolute left-1/2 top-[640px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[160px]" />
    </div>

    <div class="relative z-10 flex min-h-screen flex-col">
      <header class="fixed top-0 left-0 right-0 z-40 border-b border-slate-800/40 bg-slate-950/80 backdrop-blur-xl">
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <RouterLink to="/" class="flex items-center gap-3" @click="closeMobileNav">
            <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/80 via-blue-500/70 to-purple-500/80 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_-20px_rgba(59,130,246,0.7)]">
              FP
            </span>
            <div class="-space-y-1">
              <p class="text-sm font-semibold tracking-wide text-slate-100">
                Fabric Ports
              </p>
              <span class="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                {{ t('app.brand.tagline') }}
              </span>
            </div>
          </RouterLink>

          <nav class="hidden gap-2 text-sm font-medium md:flex">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="rounded-xl px-3 py-2 transition"
              :class="isActive(link.to)
                ? 'bg-slate-100 text-slate-900 shadow-[0_18px_46px_-26px_rgba(148,163,184,0.8)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70'"
            >
              {{ link.label }}
            </RouterLink>
          </nav>

          <div class="hidden items-center gap-2 lg:flex">
            <a
              class="inline-flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-950/70 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
              href="https://github.com/icebreaker/fabric-ports"
              rel="noreferrer"
              target="_blank"
            >
              <svg class="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  clip-rule="evenodd"
                  d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.5v-1.9c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.04 1.53 1.04.9 1.56 2.37 1.11 2.95.85.1-.68.36-1.12.66-1.37-2.22-.26-4.56-1.15-4.56-5.12 0-1.13.39-2.05 1.03-2.78-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.76 1.06a9.2 9.2 0 0 1 5 0c1.92-1.34 2.76-1.06 2.76-1.06.55 1.41.2 2.45.1 2.7.64.73 1.03 1.65 1.03 2.78 0 3.98-2.34 4.86-4.57 5.12.37.33.7.97.7 1.97v2.92c0 .28.18.61.69.5A10.22 10.22 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z"
                  fill-rule="evenodd"
                />
              </svg>
              {{ t('app.nav.github') }}
            </a>

            <button
              class="inline-flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-950/70 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
              type="button"
              :aria-label="themeToggleLabel"
              @click="toggleTheme"
            >
              <span aria-hidden="true">{{ theme === 'dark' ? '🌞' : '🌙' }}</span>
              <span>{{ theme === 'dark' ? t('app.actions.lightModeShort') : t('app.actions.darkModeShort') }}</span>
            </button>
          </div>

          <div class="hidden items-center gap-2 md:flex">
            <label class="sr-only" for="site-language-desktop">{{ t('locale.label') }}</label>
            <select
              id="site-language-desktop"
              v-model="locale"
              class="rounded-xl border border-slate-800/60 bg-slate-950/70 px-3 py-2 text-xs font-medium text-slate-300 focus:border-slate-600 focus:outline-none"
            >
              <option
                v-for="code in localeOptions"
                :key="code"
                :value="code"
              >
                {{ t(`locale.options.${code}`) }}
              </option>
            </select>
          </div>

          <button
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/60 bg-slate-950/70 text-slate-300 transition hover:border-slate-700 hover:text-slate-100 md:hidden"
            type="button"
            :aria-label="t('app.nav.toggle')"
            @click="toggleMobileNav"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                v-if="!showMobileNav"
                d="M4 7h16M4 12h16M4 17h16"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
              <path
                v-else
                d="M6 6l12 12M6 18L18 6"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
            </svg>
          </button>
        </div>

        <div
          v-if="showMobileNav"
          class="absolute left-0 right-0 top-full border-t border-slate-800/40 bg-slate-950/95 px-4 pb-6 pt-2 md:hidden"
        >
          <nav class="flex flex-col gap-1 text-sm font-medium">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="rounded-lg px-3 py-2 transition"
              :class="isActive(link.to)
                ? 'bg-slate-100 text-slate-900 shadow-[0_18px_46px_-26px_rgba(148,163,184,0.8)]'
                : 'text-slate-400 hover:bg-slate-900/70 hover:text-slate-100'"
              @click="closeMobileNav"
            >
              {{ link.label }}
            </RouterLink>
            <a
              class="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-900/70 hover:text-slate-100"
              href="https://github.com/icebreaker/fabric-ports"
              rel="noreferrer"
              target="_blank"
              @click="closeMobileNav"
            >
              {{ t('app.nav.github') }}
            </a>
            <button
              class="rounded-lg px-3 py-2 text-left text-slate-300 transition hover:bg-slate-900/70 hover:text-slate-100"
              type="button"
              @click="toggleTheme"
            >
              {{ theme === 'dark' ? t('app.actions.lightMode') : t('app.actions.darkMode') }}
            </button>
            <div class="mt-3">
              <label class="sr-only" for="site-language-mobile">{{ t('locale.label') }}</label>
              <select
                id="site-language-mobile"
                v-model="locale"
                class="w-full rounded-lg border border-slate-800/60 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-300 focus:border-slate-600 focus:outline-none"
              >
                <option
                  v-for="code in localeOptions"
                  :key="`mobile-${code}`"
                  :value="code"
                >
                  {{ t(`locale.options.${code}`) }}
                </option>
              </select>
            </div>
          </nav>
        </div>
      </header>

      <main class="relative z-10 flex-1 px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <RouterView />
      </main>

      <footer class="relative z-10 border-t border-slate-800/40 bg-slate-950/70">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p class="text-xs text-slate-400">
            {{ t('app.footer.builtWith') }}
          </p>
          <p class="text-[11px] uppercase tracking-[0.32em] text-slate-600">
            {{ t('app.footer.copyright', { year }) }}
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>
