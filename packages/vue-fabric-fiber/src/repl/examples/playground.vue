<script setup lang="ts">
import type {
  FabricCircleModelValue,
  FabricImageModelValue,
  FabricRectModelValue,
  FabricTextModelValue,
} from 'vue-fabric-fiber'
import { computed, ref, watch } from 'vue'
import {
  FabricCanvas,
  FabricCircle,
  FabricImage,
  FabricRect,
  FabricText,
  RenderGroup,
} from 'vue-fabric-fiber'

type NodeType = 'text' | 'image' | 'rect' | 'circle'

type CanvasNode
  = | { id: string, type: 'text', props: FabricTextModelValue }
    | { id: string, type: 'image', props: FabricImageModelValue }
    | { id: string, type: 'rect', props: FabricRectModelValue }
    | { id: string, type: 'circle', props: FabricCircleModelValue }

const SUPPORTED_TYPES: NodeType[] = ['text', 'image', 'rect', 'circle']

const heroPreset = JSON.stringify(
  [
    {
      id: 'backdrop',
      type: 'image',
      props: {
        src: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?auto=format&fit=crop&w=1600&q=80',
        width: 720,
        height: 480,
        selectable: false,
        hasControls: false,
      },
    },
    {
      id: 'gradient-veil',
      type: 'rect',
      props: {
        width: 720,
        height: 480,
        left: 0,
        top: 0,
        fill: 'rgba(8, 47, 73, 0.55)',
        selectable: false,
        stroke: '',
      },
    },
    {
      id: 'badge',
      type: 'rect',
      props: {
        width: 200,
        height: 44,
        left: 60,
        top: 60,
        rx: 22,
        ry: 22,
        fill: '#38bdf8',
        opacity: 0.85,
        selectable: false,
      },
    },
    {
      id: 'badge-text',
      type: 'text',
      props: {
        text: 'Reactive Fabric',
        left: 78,
        top: 70,
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: '600',
        fill: '#020617',
        selectable: false,
      },
    },
    {
      id: 'headline',
      type: 'text',
      props: {
        text: 'Design with Vue-first bindings',
        left: 60,
        top: 140,
        fontSize: 64,
        fontFamily: 'Inter',
        fontWeight: '700',
        fill: '#f8fafc',
        width: 520,
        lineHeight: 1.1,
      },
    },
    {
      id: 'cta',
      type: 'text',
      props: {
        text: 'Drag on canvas or edit JSON →',
        left: 60,
        top: 320,
        fontSize: 28,
        fontFamily: 'DM Sans',
        fontWeight: '500',
        fill: '#fbbf24',
      },
    },
  ],
  null,
  2,
)

const neonPreset = JSON.stringify(
  [
    {
      id: 'backdrop',
      type: 'rect',
      props: {
        width: 720,
        height: 480,
        left: 0,
        top: 0,
        fill: '#0f172a',
        selectable: false,
      },
    },
    {
      id: 'orbital',
      type: 'circle',
      props: {
        radius: 120,
        left: 460,
        top: 120,
        fill: 'rgba(168, 85, 247, 0.28)',
        stroke: '#a855f7',
        strokeWidth: 3,
        selectable: false,
      },
    },
    {
      id: 'orbital-ring',
      type: 'circle',
      props: {
        radius: 160,
        left: 420,
        top: 80,
        fill: '',
        stroke: 'rgba(59, 130, 246, 0.65)',
        strokeWidth: 2,
        selectable: false,
      },
    },
    {
      id: 'caption',
      type: 'text',
      props: {
        text: 'Neon Motion Boards',
        left: 80,
        top: 120,
        fontSize: 56,
        fontFamily: 'DM Sans',
        fontWeight: '700',
        fill: '#38bdf8',
        shadow: {
          color: 'rgba(14, 165, 233, 0.55)',
          blur: 16,
          offsetX: 0,
          offsetY: 0,
        },
      },
    },
    {
      id: 'subheading',
      type: 'text',
      props: {
        text: 'Tap into Fabric for motion-ready boards and overlays.',
        left: 82,
        top: 200,
        width: 420,
        fontSize: 26,
        fontFamily: 'DM Sans',
        fill: '#cbd5f5',
        lineHeight: 1.3,
      },
    },
  ],
  null,
  2,
)

const statsPreset = JSON.stringify(
  [
    {
      id: 'base',
      type: 'rect',
      props: {
        width: 720,
        height: 480,
        left: 0,
        top: 0,
        fill: '#020617',
        selectable: false,
      },
    },
    {
      id: 'chart',
      type: 'image',
      props: {
        src: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
        width: 720,
        height: 480,
        opacity: 0.22,
        selectable: false,
        hasControls: false,
      },
    },
    {
      id: 'stat-background',
      type: 'rect',
      props: {
        width: 360,
        height: 240,
        left: 60,
        top: 120,
        fill: 'rgba(15, 23, 42, 0.82)',
        stroke: 'rgba(148, 163, 184, 0.35)',
        strokeWidth: 1.5,
        rx: 22,
        ry: 22,
        selectable: false,
      },
    },
    {
      id: 'stat-title',
      type: 'text',
      props: {
        text: 'Live Conversions',
        left: 88,
        top: 150,
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: 26,
        fill: '#e2e8f0',
        selectable: false,
      },
    },
    {
      id: 'stat-value',
      type: 'text',
      props: {
        text: '4,982',
        left: 88,
        top: 200,
        fontFamily: 'DM Sans',
        fontWeight: '700',
        fontSize: 72,
        fill: '#38bdf8',
        selectable: false,
      },
    },
    {
      id: 'stat-delta',
      type: 'text',
      props: {
        text: '+18% week over week',
        left: 90,
        top: 280,
        fontFamily: 'Inter',
        fontWeight: '500',
        fontSize: 24,
        fill: '#4ade80',
        selectable: false,
      },
    },
  ],
  null,
  2,
)

const presets = [
  { id: 'hero', label: 'Gradient hero', snippet: heroPreset },
  { id: 'neon', label: 'Neon poster', snippet: neonPreset },
  { id: 'stats', label: 'Stats panel', snippet: statsPreset },
]

const presetMap = Object.fromEntries(presets.map(preset => [preset.id, preset]))

const activePreset = ref<(typeof presets)[number]['id']>(presets[0]!.id)
const editorValue = ref(presets[0]!.snippet)
const canvasNodes = ref<CanvasNode[]>([])
const parseError = ref<string | null>(null)
const isDirty = ref(false)

function sanitiseNodes(raw: unknown): CanvasNode[] {
  if (!Array.isArray(raw)) {
    throw new TypeError('Playground expects an array of nodes.')
  }

  return raw.map((entry, index) => {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error(`Entry ${index + 1} must be an object.`)
    }

    const candidate = entry as Partial<CanvasNode> & { type?: string, props?: unknown }
    const type = candidate.type

    if (typeof type !== 'string' || !SUPPORTED_TYPES.includes(type as NodeType)) {
      throw new Error(`Entry ${index + 1} has unsupported type "${type}".`)
    }

    const props = candidate.props
    if (typeof props !== 'object' || props === null) {
      throw new Error(`Entry ${index + 1} is missing a props object.`)
    }

    const identifier = typeof candidate.id === 'string' ? candidate.id : `${type}-${index}`

    const nodeType = type as NodeType

    if (nodeType === 'text') {
      const textProps = props as Record<string, unknown>
      const textContent = textProps.text
      if (typeof textContent !== 'string') {
        throw new TypeError(`Entry ${index + 1} text node requires a string "text" value.`)
      }

      const typed: FabricTextModelValue = {
        text: textContent,
        ...textProps,
      } as FabricTextModelValue

      return {
        id: identifier,
        type: nodeType,
        props: typed,
      }
    }

    if (nodeType === 'image') {
      const imageProps = props as Record<string, unknown>
      const src = imageProps.src
      if (typeof src !== 'string' || !src.length) {
        throw new Error(`Entry ${index + 1} image node requires a non-empty "src".`)
      }

      const typed: FabricImageModelValue = {
        src,
        left: typeof imageProps.left === 'number' ? imageProps.left : undefined,
        top: typeof imageProps.top === 'number' ? imageProps.top : undefined,
        width: typeof imageProps.width === 'number' || typeof imageProps.width === 'string' ? imageProps.width : undefined,
        height: typeof imageProps.height === 'number' || typeof imageProps.height === 'string' ? imageProps.height : undefined,
        selectable: typeof imageProps.selectable === 'boolean' ? imageProps.selectable : undefined,
        hasControls: typeof imageProps.hasControls === 'boolean' ? imageProps.hasControls : undefined,
        opacity: typeof imageProps.opacity === 'number' ? imageProps.opacity : undefined,
        angle: typeof imageProps.angle === 'number' ? imageProps.angle : undefined,
        scaleX: typeof imageProps.scaleX === 'number' ? imageProps.scaleX : undefined,
        scaleY: typeof imageProps.scaleY === 'number' ? imageProps.scaleY : undefined,
      }

      return {
        id: identifier,
        type: nodeType,
        props: typed,
      }
    }

    if (nodeType === 'rect') {
      return {
        id: identifier,
        type: nodeType,
        props: { ...props } as FabricRectModelValue,
      }
    }

    if (nodeType === 'circle') {
      return {
        id: identifier,
        type: nodeType,
        props: { ...props } as FabricCircleModelValue,
      }
    }

    return {
      id: identifier,
      type: nodeType,
      props: props as never,
    }
  })
}

function parseSource(source: string) {
  const parsed = JSON.parse(source)
  const nodes = sanitiseNodes(parsed)
  canvasNodes.value = nodes
  parseError.value = null
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown parse error.'
}

function loadPreset(presetId: string) {
  const preset = presetMap[presetId]
  if (!preset) {
    return
  }

  activePreset.value = presetId
  editorValue.value = preset.snippet
  isDirty.value = false

  try {
    parseSource(preset.snippet)
  }
  catch (error) {
    parseError.value = formatError(error)
  }
}

function resetSnippet() {
  loadPreset(activePreset.value)
}

let parseTimer: ReturnType<typeof setTimeout> | undefined

watch(editorValue, (value) => {
  const preset = presetMap[activePreset.value]
  isDirty.value = preset ? value.trim() !== preset.snippet.trim() : true

  if (parseTimer) {
    clearTimeout(parseTimer)
  }

  parseTimer = setTimeout(() => {
    try {
      parseSource(value)
    }
    catch (error) {
      parseError.value = formatError(error)
    }
  }, 220)
})

try {
  parseSource(editorValue.value)
}
catch (error) {
  parseError.value = formatError(error)
}

const supportedLegend = computed(() => [
  { label: 'text', component: '<FabricText />' },
  { label: 'image', component: '<FabricImage />' },
  { label: 'rect', component: '<FabricRect />' },
  { label: 'circle', component: '<FabricCircle />' },
])
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-12">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute -left-12 top-6 h-72 w-72 rounded-full bg-sky-500/20 blur-[160px]" />
      <div aria-hidden="true" class="absolute right-[-140px] bottom-[-80px] h-80 w-80 rounded-full bg-purple-500/15 blur-[180px]" />
      <div class="relative max-w-3xl space-y-5">
        <span class="eyebrow">Live playground</span>
        <h1 class="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
          Edit scene instructions and render Fabric canvases instantly
        </h1>
        <p class="text-sm leading-relaxed text-slate-300 sm:text-base">
          Describe objects with JSON, swap presets, and manipulate nodes directly on canvas. The playground keeps the preview synced
          with every keystroke.
        </p>
        <div class="flex flex-wrap gap-3 text-xs text-slate-400">
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-cyan-300" />
            JSON → Fabric bindings
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-amber-300" />
            Drag on canvas to inspect props
          </span>
        </div>
      </div>
    </section>

    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <section class="relative overflow-hidden rounded-[32px] surface-panel p-6 sm:p-8">
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-400/12 via-transparent to-purple-500/12" />
        <div class="relative flex h-full flex-col gap-4">
          <header class="flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-1">
              <span class="eyebrow">Scene blueprint</span>
              <p class="text-xs text-slate-400">
                Supported keys map to Fabric components. Switch a preset or edit below.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="preset in presets"
                :key="preset.id"
                class="rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition"
                :class="preset.id === activePreset
                  ? 'border-slate-200 bg-slate-100 text-slate-900'
                  : 'border-slate-800/60 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-slate-100'"
                type="button"
                @click="loadPreset(preset.id)"
              >
                {{ preset.label }}
              </button>
            </div>
          </header>

          <div class="relative flex-1 overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/80 shadow-inner">
            <textarea
              v-model="editorValue"
              spellcheck="false"
              autocapitalize="off"
              autocomplete="off"
              class="h-[520px] w-full resize-none bg-transparent p-5 font-mono text-[13px] leading-relaxed text-slate-200 outline-none"
            />
            <div
              v-if="parseError"
              class="absolute inset-x-0 bottom-0 border-t border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"
            >
              {{ parseError }}
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>
              Supported nodes:
              <span
                v-for="legend in supportedLegend"
                :key="legend.label"
                class="mr-2 inline-flex items-center gap-1 rounded-full border border-slate-800/60 bg-slate-900/70 px-2 py-1 text-[10px] uppercase tracking-[0.28em]"
              >
                {{ legend.label }}
                <span class="text-slate-400">{{ legend.component }}</span>
              </span>
            </p>
            <button
              class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-3 py-1.5 text-[11px] font-medium text-slate-200 transition hover:border-slate-700 hover:text-slate-100"
              type="button"
              :disabled="!isDirty"
              :class="{ 'opacity-40 pointer-events-none': !isDirty }"
              @click="resetSnippet"
            >
              Reset snippet
            </button>
          </div>
        </div>
      </section>

      <section class="relative overflow-hidden rounded-[32px] surface-panel-muted p-6 sm:p-8">
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-tr from-sky-400/10 via-transparent to-violet-500/12" />
        <div class="relative space-y-5">
          <header class="space-y-2">
            <span class="eyebrow">Canvas preview</span>
            <h2 class="text-lg font-semibold text-slate-100">
              Rendered Fabric scene
            </h2>
            <p class="text-xs leading-relaxed text-slate-400">
              Drag objects to inspect their props or tweak values in the editor. Parsed nodes update immediately—errors preserve the
              last valid render.
            </p>
          </header>

          <div class="overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/80 shadow-[0_40px_90px_-48px_rgba(15,23,42,0.9)]">
            <FabricCanvas :canvas-options="{ width: 720, height: 480, preserveObjectStacking: true }">
              <RenderGroup>
                <template v-for="node in canvasNodes" :key="node.id">
                  <FabricText v-if="node.type === 'text'" v-model="node.props" />
                  <FabricImage v-else-if="node.type === 'image'" v-model="node.props" />
                  <FabricRect v-else-if="node.type === 'rect'" v-model="node.props" />
                  <FabricCircle v-else-if="node.type === 'circle'" v-model="node.props" />
                </template>
              </RenderGroup>
            </FabricCanvas>
          </div>

          <ul class="grid gap-3 text-xs text-slate-400">
            <li class="rounded-2xl border border-slate-800/60 bg-slate-950/70 px-4 py-3">
              <span class="font-semibold text-slate-200">
                Tip:
              </span>
              Add more nodes by extending the JSON array—each object becomes a Fabric component.
            </li>
            <li class="rounded-2xl border border-slate-800/60 bg-slate-950/70 px-4 py-3">
              <span class="font-semibold text-slate-200">
                Tip:
              </span>
              Use the inspector tools in other demos to capture props and paste them here for rapid iteration.
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>
