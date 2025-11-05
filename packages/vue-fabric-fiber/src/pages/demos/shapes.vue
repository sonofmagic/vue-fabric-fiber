<script setup lang="ts">
import type {
  FabricCircleModelValue,
  FabricEllipseModelValue,
  FabricLineModelValue,
  FabricPathModelValue,
  FabricPolygonModelValue,
  FabricPolylineModelValue,
  FabricRectModelValue,
  FabricTriangleModelValue,
} from '~/index'
import { computed, ref, watch } from 'vue'
import {
  FabricCanvas,
  FabricCircle,
  FabricEllipse,
  FabricLine,
  FabricPath,
  FabricPolygon,
  FabricPolyline,
  FabricRect,
  FabricTriangle,
} from '~/index'

const polylinePresets = {
  wave: [
    { x: 0, y: 60 },
    { x: 70, y: 10 },
    { x: 160, y: 80 },
    { x: 250, y: 20 },
    { x: 320, y: 70 },
  ],
  ridge: [
    { x: 0, y: 80 },
    { x: 60, y: 0 },
    { x: 120, y: 60 },
    { x: 180, y: 10 },
    { x: 260, y: 80 },
    { x: 320, y: 30 },
  ],
} as const

const polygonPresets = {
  pentagon: [
    { x: 0, y: -80 },
    { x: 76, y: -24 },
    { x: 50, y: 68 },
    { x: -50, y: 68 },
    { x: -76, y: -24 },
  ],
  star: [
    { x: 0, y: -90 },
    { x: 28, y: -18 },
    { x: 90, y: -18 },
    { x: 44, y: 20 },
    { x: 62, y: 88 },
    { x: 0, y: 48 },
    { x: -62, y: 88 },
    { x: -44, y: 20 },
    { x: -90, y: -18 },
    { x: -28, y: -18 },
  ],
} as const

const pathPresets = {
  breeze: 'M 100 460 C 240 420 320 540 420 460 S 640 420 720 480',
  loop: 'M 140 470 C 220 350 420 350 500 470 S 720 590 780 470',
  ribbon: 'M 60 420 Q 220 520 380 420 T 700 420',
} as const

type PolylinePresetKey = keyof typeof polylinePresets
type PolygonPresetKey = keyof typeof polygonPresets
type PathPresetKey = keyof typeof pathPresets

const polylinePresetKeys = Object.keys(polylinePresets) as PolylinePresetKey[]
const polygonPresetKeys = Object.keys(polygonPresets) as PolygonPresetKey[]
const pathPresetKeys = Object.keys(pathPresets) as PathPresetKey[]

const rectModel = ref<FabricRectModelValue>({
  width: 180,
  height: 120,
  rx: 18,
  ry: 18,
  fill: '#38bdf8',
  stroke: '#0f172a',
  strokeWidth: 2,
  left: 140,
  top: 120,
  opacity: 0.92,
})

const circleModel = ref<FabricCircleModelValue>({
  radius: 70,
  fill: '#facc15',
  stroke: '#f97316',
  strokeWidth: 4,
  left: 360,
  top: 200,
  opacity: 0.9,
})

const ellipseModel = ref<FabricEllipseModelValue>({
  rx: 110,
  ry: 60,
  fill: '',
  stroke: '#22d3ee',
  strokeWidth: 6,
  left: 520,
  top: 120,
  angle: -6,
})

const triangleModel = ref<FabricTriangleModelValue>({
  width: 160,
  height: 160,
  fill: 'rgba(244,114,182,0.35)',
  stroke: '#f472b6',
  strokeWidth: 4,
  left: 720,
  top: 200,
})

const lineModel = ref<FabricLineModelValue>({
  x1: 140,
  y1: 420,
  x2: 780,
  y2: 320,
  stroke: '#fb7185',
  strokeWidth: 8,
  strokeLineCap: 'round',
})

const pathModel = ref<FabricPathModelValue>({
  path: pathPresets.breeze,
  stroke: '#38bdf8',
  strokeWidth: 6,
  fill: '',
  strokeLineJoin: 'round',
})

const pathInput = computed({
  get: () => pathModel.value.path ?? '',
  set: (value: string) => {
    pathModel.value = {
      ...pathModel.value,
      path: value,
    }
  },
})

const polylineModel = ref<FabricPolylineModelValue>({
  points: polylinePresets.wave.map(point => ({ ...point })),
  stroke: '#a855f7',
  strokeWidth: 4,
  fill: '',
  left: 120,
  top: 40,
})

const polygonModel = ref<FabricPolygonModelValue>({
  points: polygonPresets.pentagon.map(point => ({ ...point })),
  fill: 'rgba(74,222,128,0.22)',
  stroke: '#4ade80',
  strokeWidth: 3,
  left: 620,
  top: 320,
})

const rectCornerRadius = ref<number>(rectModel.value.rx ?? 18)
watch(rectCornerRadius, (value) => {
  rectModel.value.rx = value
  rectModel.value.ry = value
})

const lineLength = computed(() => {
  const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = lineModel.value
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.round(Math.hypot(dx, dy))
})

const activePolylinePreset = ref<PolylinePresetKey>('wave')
const activePolygonPreset = ref<PolygonPresetKey>('pentagon')
const activePathPreset = ref<PathPresetKey>('breeze')

function applyPolylinePreset(preset: PolylinePresetKey) {
  activePolylinePreset.value = preset
  polylineModel.value = {
    ...polylineModel.value,
    points: polylinePresets[preset].map(point => ({ ...point })),
  }
}

function applyPolygonPreset(preset: PolygonPresetKey) {
  activePolygonPreset.value = preset
  polygonModel.value = {
    ...polygonModel.value,
    points: polygonPresets[preset].map(point => ({ ...point })),
  }
}

function applyPathPreset(preset: PathPresetKey) {
  activePathPreset.value = preset
  pathModel.value = {
    ...pathModel.value,
    path: pathPresets[preset] ?? pathModel.value.path,
  }
}

function randomizeLine() {
  const width = 820
  const height = 520
  lineModel.value = {
    ...lineModel.value,
    x1: 100 + Math.random() * (width / 2),
    y1: 280 + Math.random() * (height / 2 - 40),
    x2: 360 + Math.random() * (width / 2),
    y2: 260 + Math.random() * (height / 2),
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-10 py-8 xl:flex-row">
    <div class="rounded-3xl border border-slate-900 bg-slate-950/80 p-6 shadow-2xl">
      <FabricCanvas :canvas-options="{ width: 920, height: 560, preserveObjectStacking: true, selection: true }">
        <FabricRect v-model="rectModel" />
        <FabricCircle v-model="circleModel" />
        <FabricEllipse v-model="ellipseModel" />
        <FabricTriangle v-model="triangleModel" />
        <FabricLine v-model="lineModel" />
        <FabricPath v-model="pathModel" />
        <FabricPolyline v-model="polylineModel" />
        <FabricPolygon v-model="polygonModel" />
      </FabricCanvas>
    </div>

    <aside class="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-slate-900 bg-slate-950/85 p-6 text-sm text-slate-100">
      <header class="space-y-2">
        <h1 class="text-lg font-semibold text-slate-100">
          Shape Toolkit
        </h1>
        <p class="text-xs leading-relaxed text-slate-400">
          Adjust Fabric primitives through Vue bindings. Drag nodes directly on the canvas or tweak props below—the components
          stay synchronized either way.
        </p>
      </header>

      <section class="space-y-3 rounded-xl border border-slate-900 bg-slate-950/90 p-4">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Rectangle
        </h2>
        <div class="grid gap-2 text-xs text-slate-300">
          <label class="flex items-center justify-between">
            <span>Width</span>
            <input v-model.number="rectModel.width" class="w-32 rounded-md border border-slate-800 bg-slate-900 px-2 py-1" max="360" min="40" step="10" type="range">
          </label>
          <label class="flex items-center justify-between">
            <span>Height</span>
            <input v-model.number="rectModel.height" class="w-32 rounded-md border border-slate-800 bg-slate-900 px-2 py-1" max="260" min="40" step="10" type="range">
          </label>
          <label class="flex items-center justify-between">
            <span>Corner</span>
            <input v-model.number="rectCornerRadius" class="w-32 rounded-md border border-slate-800 bg-slate-900 px-2 py-1" max="48" min="0" step="2" type="range">
          </label>
          <label class="flex items-center gap-2">
            <span class="w-16">Fill</span>
            <input v-model="rectModel.fill" class="h-7 w-16 cursor-pointer rounded border border-slate-800" type="color">
          </label>
        </div>
      </section>

      <section class="space-y-3 rounded-xl border border-slate-900 bg-slate-950/90 p-4">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Circle & Ellipse
        </h2>
        <div class="grid gap-2 text-xs text-slate-300">
          <label class="flex items-center justify-between">
            <span>Radius</span>
            <input v-model.number="circleModel.radius" class="w-32 rounded-md border border-slate-800 bg-slate-900 px-2 py-1" max="140" min="20" step="5" type="range">
          </label>
          <label class="flex items-center gap-2">
            <span class="w-16">Circle Fill</span>
            <input v-model="circleModel.fill" class="h-7 w-16 cursor-pointer rounded border border-slate-800" type="color">
          </label>
          <label class="flex items-center justify-between">
            <span>Ellipse rx</span>
            <input v-model.number="ellipseModel.rx" class="w-32 rounded-md border border-slate-800 bg-slate-900 px-2 py-1" max="160" min="40" step="5" type="range">
          </label>
          <label class="flex items-center justify-between">
            <span>Ellipse ry</span>
            <input v-model.number="ellipseModel.ry" class="w-32 rounded-md border border-slate-800 bg-slate-900 px-2 py-1" max="120" min="20" step="5" type="range">
          </label>
          <label class="flex items-center gap-2">
            <span class="w-16">Stroke</span>
            <input v-model="ellipseModel.stroke" class="h-7 w-16 cursor-pointer rounded border border-slate-800" type="color">
          </label>
        </div>
      </section>

      <section class="space-y-3 rounded-xl border border-slate-900 bg-slate-950/90 p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Line
          </h2>
          <span class="text-[11px] text-slate-500">
            {{ lineLength }}px
          </span>
        </div>
        <div class="grid gap-2 text-xs text-slate-300">
          <label class="flex items-center justify-between">
            <span>Stroke</span>
            <input v-model="lineModel.stroke" class="h-7 w-16 cursor-pointer rounded border border-slate-800" type="color">
          </label>
          <label class="flex items-center justify-between">
            <span>Weight</span>
            <input v-model.number="lineModel.strokeWidth" class="w-32 rounded-md border border-slate-800 bg-slate-900 px-2 py-1" max="12" min="1" type="range">
          </label>
          <button class="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-800" type="button" @click="randomizeLine">
            Randomize anchor points
          </button>
        </div>
      </section>

      <section class="space-y-3 rounded-xl border border-slate-900 bg-slate-950/90 p-4">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Path Variants
        </h2>
        <div class="flex gap-2">
          <button
            v-for="preset in pathPresetKeys"
            :key="preset"
            class="flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold capitalize transition"
            :class="activePathPreset === preset
              ? 'border-slate-300 bg-slate-100 text-slate-900'
              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'"
            type="button"
            @click="applyPathPreset(preset)"
          >
            {{ preset }}
          </button>
        </div>
        <textarea
          v-model="pathInput"
          class="h-20 rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:border-slate-600 focus:outline-none"
        />
      </section>

      <section class="space-y-3 rounded-xl border border-slate-900 bg-slate-950/90 p-4">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Polyline Presets
        </h2>
        <div class="flex gap-2">
          <button
            v-for="preset in polylinePresetKeys"
            :key="preset"
            class="flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold capitalize transition"
            :class="activePolylinePreset === preset
              ? 'border-slate-300 bg-slate-100 text-slate-900'
              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'"
            type="button"
            @click="applyPolylinePreset(preset)"
          >
            {{ preset }}
          </button>
        </div>
      </section>

      <section class="space-y-3 rounded-xl border border-slate-900 bg-slate-950/90 p-4">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Polygon Presets
        </h2>
        <div class="flex gap-2">
          <button
            v-for="preset in polygonPresetKeys"
            :key="preset"
            class="flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold capitalize transition"
            :class="activePolygonPreset === preset
              ? 'border-slate-300 bg-slate-100 text-slate-900'
              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'"
            type="button"
            @click="applyPolygonPreset(preset)"
          >
            {{ preset }}
          </button>
        </div>
      </section>
    </aside>
  </div>
</template>
