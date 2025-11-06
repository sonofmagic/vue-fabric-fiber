<script setup lang="ts">
import { Repl, useStore } from '@vue/repl'
import Codemirror from '@vue/repl/codemirror-editor'
import { computed, onMounted, ref, shallowRef, version as vueVersion } from 'vue'
import { loadLibraryFiles } from '@/repl/library-files'
import appStyleUrl from '@/style.css?url'
import '@vue/repl/style.css'

const props = withDefaults(defineProps<{
  source: string
  filename?: string
  height?: number | string
}>(), {
  filename: 'DemoExample.vue',
  height: '720px',
})

const store = shallowRef<ReturnType<typeof useStore>>()
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

const runtimeUrl = `https://cdn.jsdelivr.net/npm/vue@${vueVersion}/dist/vue.esm-browser.js`
const ssrUrl = `https://cdn.jsdelivr.net/npm/@vue/server-renderer@${vueVersion}/dist/server-renderer.esm-browser.js`
const fabricUrl = 'https://cdn.jsdelivr.net/npm/fabric@6.7.1/dist/index.min.mjs'
const pQueueUrl = 'https://cdn.jsdelivr.net/npm/p-queue@9.0.0/+esm'

const previewOptions = computed(() => ({
  headHTML: `<link rel="stylesheet" href="${appStyleUrl}">`,
}))

const shellStyle = computed(() => ({
  '--demo-repl-height': typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

function getEntryFilename() {
  return props.filename.endsWith('.vue') ? props.filename : `${props.filename}.vue`
}

async function bootstrapStore() {
  try {
    const libFiles = await loadLibraryFiles()
    const demoFile = getEntryFilename()
    const files: Record<string, string> = {
      ...libFiles,
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

    await replStore.setFiles(files, demoFile)
    replStore.setImportMap({
      imports: {
        'vue': runtimeUrl,
        'vue/server-renderer': ssrUrl,
        'vue-fabric-fiber': './vue-fabric-fiber/index.ts',
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
  <div class="demo-repl surface-panel rounded-[32px] border border-slate-800/60 bg-slate-950/75 p-3" :style="shellStyle">
    <div v-if="errorMessage" class="flex min-h-[200px] items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-12 text-center text-sm text-red-200">
      Failed to load playground:
      <br>
      {{ errorMessage }}
    </div>
    <div v-else-if="isLoading" class="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 px-6 py-12 text-sm text-slate-400">
      <svg class="h-5 w-5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" stroke-linecap="round" stroke-width="4" />
      </svg>
      Preparing interactive playground…
    </div>
    <Repl
      v-else-if="store"
      :store="store"
      :editor="Codemirror"
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
  min-height: var(--demo-repl-height);
}

.demo-repl :deep(.split-pane-container) {
  min-height: var(--demo-repl-height);
  height: 100%;
}

.demo-repl :deep(.split-pane) {
  height: 100%;
}

.demo-repl :deep(.pane) {
  min-height: var(--demo-repl-height);
}

.demo-repl :deep(.pane.editor) {
  border-right: 1px solid rgb(15 23 42 / 0.6);
}

@media (max-width: 1024px) {
  .demo-repl :deep(.vue-repl) {
    min-height: calc(var(--demo-repl-height) + 240px);
  }
}
</style>
