<script setup lang="ts">
import type { ThemeName } from '@/constants/theme'
import { codeToHtml } from 'shiki/bundle/web'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { readThemeFromDocument, THEME_EVENT_NAME } from '@/constants/theme'

interface ShikiCodeBlockProps {
  code: string
  lang?: string
  title?: string
  theme?: string
  darkTheme?: string
  lightTheme?: string
  adaptive?: boolean
}

const props = withDefaults(defineProps<ShikiCodeBlockProps>(), {
  lang: 'vue',
  darkTheme: 'dark-plus',
  lightTheme: 'github-light',
  adaptive: true,
})

const isLoading = ref(false)
const highlighted = ref('')
const errorMessage = ref('')
const currentTheme = ref<ThemeName>('dark')

if (typeof document !== 'undefined') {
  currentTheme.value = readThemeFromDocument()
}

let removeThemeListener: (() => void) | null = null

onMounted(() => {
  currentTheme.value = readThemeFromDocument()
  if (typeof window !== 'undefined') {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: ThemeName }>).detail
      if (detail?.theme) {
        currentTheme.value = detail.theme
      }
      else {
        currentTheme.value = readThemeFromDocument()
      }
    }
    window.addEventListener(THEME_EVENT_NAME, handler as EventListener)
    removeThemeListener = () => {
      window.removeEventListener(THEME_EVENT_NAME, handler as EventListener)
    }
  }
})

onBeforeUnmount(() => {
  removeThemeListener?.()
  removeThemeListener = null
})

const normalizedCode = computed(() => props.code?.trim() ?? '')
const shikiTheme = computed(() => {
  if (props.theme) {
    return props.theme
  }
  if (!props.adaptive) {
    return props.darkTheme
  }
  return currentTheme.value === 'dark' ? props.darkTheme : props.lightTheme
})

async function highlight() {
  if (!normalizedCode.value) {
    highlighted.value = ''
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    highlighted.value = await codeToHtml(normalizedCode.value, {
      lang: props.lang,
      theme: shikiTheme.value,
    })
  }
  catch (error) {
    errorMessage.value = (error as Error)?.message ?? 'Failed to highlight code.'
    highlighted.value = ''
  }
  finally {
    isLoading.value = false
  }
}

watch(
  () => [normalizedCode.value, props.lang, shikiTheme.value],
  () => {
    highlight()
  },
  { immediate: true },
)
</script>

<template>
  <div class="code-block rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
    <p v-if="title" class="mb-3 text-[11px] uppercase tracking-[0.28em] text-slate-400">
      {{ title }}
    </p>
    <div v-if="isLoading" class="text-xs text-slate-500">
      Highlighting code…
    </div>
    <div v-else-if="errorMessage" class="text-xs text-rose-300">
      {{ errorMessage }}
    </div>
    <div v-else class="shiki-output" v-html="highlighted" />
  </div>
</template>

<style scoped>
.code-block {
  font-family: 'JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Consolas', monospace;
}

.shiki-output {
  overflow-x: auto;
}

.shiki-output :deep(pre) {
  margin: 0;
  background: transparent;
  font-size: 0.85rem;
  line-height: 1.65;
}

.shiki-output :deep(code) {
  font-family: inherit;
}
</style>
