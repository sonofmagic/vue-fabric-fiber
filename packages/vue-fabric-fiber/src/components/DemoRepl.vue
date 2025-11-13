<script setup lang="ts">
import { Repl, useStore } from '@vue/repl'
import CodeMirror from '@vue/repl/codemirror-editor'
import { computed, onMounted, ref, shallowRef, version as vueVersion } from 'vue'
import { useI18n } from 'vue-i18n'
import appStyleUrl from '@/style.css?url'

const props = withDefaults(defineProps<{
  source: string
  filename?: string
  height?: number | string
  fullHeight?: boolean
}>(), {
  filename: 'DemoExample.vue',
  height: '720px',
  fullHeight: false,
})

const store = shallowRef<ReturnType<typeof useStore>>()
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const { t } = useI18n()

const runtimeUrl = `https://cdn.jsdelivr.net/npm/vue@${vueVersion}/dist/vue.esm-browser.js`
const ssrUrl = `https://cdn.jsdelivr.net/npm/@vue/server-renderer@${vueVersion}/dist/server-renderer.esm-browser.js`
const fabricUrl = 'https://cdn.jsdelivr.net/npm/fabric@6.7.1/dist/index.min.mjs'
const pQueueUrl = 'https://cdn.jsdelivr.net/npm/p-queue@9.0.0/+esm'

const previewOptions = computed(() => ({
  headHTML: `<link rel="stylesheet" href="${appStyleUrl}">`,
}))

const localLibEntry = new URL('../../lib/index.ts', import.meta.url).pathname
const prodLibEntry = '/repl/vue-fabric-fiber/index.js'
const pkgImportEntry = import.meta.env.DEV ? localLibEntry : prodLibEntry

const resolvedHeight = computed(() => {
  if (props.fullHeight) {
    return 'calc(100vh - 10rem)'
  }
  return typeof props.height === 'number' ? `${props.height}px` : props.height
})

const shellStyle = computed(() => ({
  '--demo-repl-height': resolvedHeight.value,
}))

function getEntryFilename() {
  return props.filename.endsWith('.vue') ? props.filename : `${props.filename}.vue`
}

async function bootstrapStore() {
  try {
    const demoFile = getEntryFilename()
    const files: Record<string, string> = {
      'main.ts': [
        'import { createApp } from \'vue\'',
        'import App from \'./App.vue\'',
        '',
        'createApp(App).mount(\'#app\')',
        '',
      ].join('\n'),
      'App.vue': [
        '<template>',
        '  <DemoExample />',
        '</template>',
        '',
        '<script setup lang="ts">',
        `import DemoExample from './${demoFile}'`,
        '</scr' + 'ipt>',
        '',
      ].join('\n'),
      [demoFile]: props.source.trim(),
    }

    const replStore = useStore({
      showOutput: ref(true),
      outputMode: ref('preview'),
    })
    replStore.sfcOptions.template = {
      ...(replStore.sfcOptions.template ?? {}),
      hoistStatic: false,
      compilerOptions: {
        ...(replStore.sfcOptions.template?.compilerOptions ?? {}),
        hoistStatic: false,
      },
    }
    replStore.sfcOptions.script = {
      ...(replStore.sfcOptions.script ?? {}),
      inlineTemplate: false,
    }

    await replStore.setFiles(files, demoFile)
    replStore.setImportMap({
      imports: {
        'vue': runtimeUrl,
        'vue/server-renderer': ssrUrl,
        'vue-fabric-fiber': pkgImportEntry,
        'fabric': fabricUrl,
        'p-queue': pQueueUrl,
      },
    }, true)
    replStore.init()
    store.value = replStore
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  bootstrapStore()
})
</script>

<template>
  <div class="demo-repl surface-panel rounded-[32px] border border-panel bg-panel p-3" :style="shellStyle">
    <div v-if="errorMessage" class="flex min-h-[200px] items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-12 text-center text-sm text-red-200">
      {{ t('components.demoRepl.errorTitle') }}
      <br>
      {{ errorMessage }}
    </div>
    <div v-else-if="isLoading" class="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-panel bg-panel-soft px-6 py-12 text-sm text-muted">
      <svg class="h-5 w-5 animate-spin text-muted" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" stroke-linecap="round" stroke-width="4" />
      </svg>
      {{ t('components.demoRepl.loading') }}
    </div>
    <Repl
      v-else-if="store"
      :store="store"
      :editor="CodeMirror"
      theme="dark"
      layout="horizontal"
      :auto-resize="false"
      :show-compile-output="false"
      :show-import-map="false"
      :show-ssr-output="false"
      :show-ts-config="false"
      :clear-console="false"
      :preview-options="previewOptions"
    />
  </div>
</template>

<style scoped>
.demo-repl {
  --demo-repl-height: 720px;
}

.demo-repl :deep(.vue-repl) {
  display: flex;
  flex-direction: column;
  min-height: var(--demo-repl-height);
}

.demo-repl :deep(.split-pane) {
  display: flex;
  height: 100%;
  min-height: var(--demo-repl-height);
}

.demo-repl :deep(.split-pane .left),
.demo-repl :deep(.split-pane .right) {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: var(--demo-repl-height);
}

.demo-repl :deep(.split-pane .left) {
  border-right: 1px solid rgb(15 23 42 / 60%);
}

.demo-repl :deep(.split-pane .left .file-selector) {
  flex: 0 0 auto;
}

.demo-repl :deep(.split-pane .left .editor-container),
.demo-repl :deep(.split-pane .left .editor) {
  display: flex;
  flex: 1 1 auto;
  height: 100%;
  min-height: calc(var(--demo-repl-height) - 48px);
}

.demo-repl :deep(.split-pane .left .monaco-editor) {
  flex: 1 1 auto;
  width: 100% !important;
  height: 100% !important;
  min-height: calc(var(--demo-repl-height) - 48px);
}

.demo-repl :deep(.split-pane .left .monaco-editor .overflow-guard),
.demo-repl :deep(.split-pane .left .monaco-editor .monaco-scrollable-element) {
  height: 100% !important;
  min-height: calc(var(--demo-repl-height) - 48px);
}

.demo-repl :deep(.split-pane .right iframe) {
  flex: 1 1 auto;
  height: 100%;
  min-height: calc(var(--demo-repl-height) - 48px);
}

@media (width <= 1024px) {
  .demo-repl :deep(.vue-repl) {
    min-height: calc(var(--demo-repl-height) + 240px);
  }
}
</style>
