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
  <div class="mx-auto flex max-w-6xl flex-col gap-12">
    <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <div aria-hidden="true" class="absolute -left-16 top-8 h-72 w-72 rounded-full bg-emerald-400/15 blur-[180px]" />
      <div aria-hidden="true" class="absolute right-[-120px] bottom-[-80px] h-80 w-80 rounded-full bg-sky-500/15 blur-[170px]" />
      <div class="relative max-w-3xl space-y-5">
        <span class="eyebrow">Shape toolkit</span>
        <h1 class="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
          Manipulate Fabric primitives with Vue bindings
        </h1>
        <p class="text-sm leading-relaxed text-slate-300 sm:text-base">
          Adjust every geometric primitive from range inputs and colour pickers while the canvas stays interactive. Fabric Ports keeps
          model values in sync with direct manipulation on stage.
        </p>
        <div class="flex flex-wrap gap-3 text-xs text-slate-400">
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-emerald-300" />
            Two-way shape bindings
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/70 px-4 py-2">
            <span class="h-2 w-2 rounded-full bg-fuchsia-300" />
            Path + polygon presets
          </span>
        </div>
      </div>
    </section>

    <div class="grid gap-10 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
      <div class="relative overflow-hidden rounded-[32px] surface-panel p-6 sm:p-8">
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-emerald-400/12 via-transparent to-sky-500/12" />
        <div class="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/85 shadow-[0_44px_100px_-52px_rgba(15,23,42,0.95)]">
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
      </div>

      <aside class="surface-panel-muted flex flex-col gap-6 rounded-[32px] p-6 text-sm text-slate-100 sm:p-7">
        <header class="space-y-3">
          <span class="eyebrow">Primitive controls</span>
          <h2 class="text-lg font-semibold text-slate-100">
            Shape toolkit
          </h2>
          <p class="text-xs leading-relaxed text-slate-400">
            Adjust Fabric primitives through Vue bindings. Drag nodes directly on the canvas or tweak props below—the components stay
            synchronised either way.
          </p>
        </header>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Rectangle
          </h3>
          <div class="grid gap-3 text-xs text-slate-300">
            <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span>Width</span>
              <input v-model.number="rectModel.width" class="w-36 accent-slate-100" max="360" min="40" step="10" type="range">
            </label>
            <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span>Height</span>
              <input v-model.number="rectModel.height" class="w-36 accent-slate-100" max="260" min="40" step="10" type="range">
            </label>
            <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span>Corner</span>
              <input v-model.number="rectCornerRadius" class="w-36 accent-slate-100" max="48" min="0" step="2" type="range">
            </label>
            <label class="flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span class="w-20">Fill</span>
              <input v-model="rectModel.fill" class="h-9 w-16 cursor-pointer rounded border border-slate-800/60" type="color">
            </label>
          </div>
        </section>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Circle & Ellipse
          </h3>
          <div class="grid gap-3 text-xs text-slate-300">
            <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span>Radius</span>
              <input v-model.number="circleModel.radius" class="w-36 accent-slate-100" max="140" min="20" step="5" type="range">
            </label>
            <label class="flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span class="w-24">Circle fill</span>
              <input v-model="circleModel.fill" class="h-9 w-16 cursor-pointer rounded border border-slate-800/60" type="color">
            </label>
            <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span>Ellipse rx</span>
              <input v-model.number="ellipseModel.rx" class="w-36 accent-slate-100" max="160" min="40" step="5" type="range">
            </label>
            <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span>Ellipse ry</span>
              <input v-model.number="ellipseModel.ry" class="w-36 accent-slate-100" max="120" min="20" step="5" type="range">
            </label>
            <label class="flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span class="w-20">Stroke</span>
              <input v-model="ellipseModel.stroke" class="h-9 w-16 cursor-pointer rounded border border-slate-800/60" type="color">
            </label>
          </div>
        </section>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <div class="flex items-center justify-between text-xs">
            <h3 class="font-semibold uppercase tracking-[0.3em] text-slate-400">
              Line
            </h3>
            <span class="text-[11px] text-slate-500">
              {{ lineLength }} px
            </span>
          </div>
          <div class="grid gap-3 text-xs text-slate-300">
            <label class="flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span class="w-20">Stroke</span>
              <input v-model="lineModel.stroke" class="h-9 w-16 cursor-pointer rounded border border-slate-800/60" type="color">
            </label>
            <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2">
              <span>Weight</span>
              <input v-model.number="lineModel.strokeWidth" class="w-36 accent-slate-100" max="12" min="1" type="range">
            </label>
            <button class="rounded-xl border border-slate-800/60 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-900" type="button" @click="randomizeLine">
              Randomize anchor points
            </button>
          </div>
        </section>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Path variants
          </h3>
          <div class="flex gap-2">
            <button
              v-for="preset in pathPresetKeys"
              :key="preset"
              class="flex-1 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition"
              :class="activePathPreset === preset
                ? 'border-slate-200 bg-slate-100 text-slate-900'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'"
              type="button"
              @click="applyPathPreset(preset)"
            >
              {{ preset }}
            </button>
          </div>
          <textarea
            v-model="pathInput"
            class="h-32 rounded-xl border border-slate-800/60 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 focus:border-slate-600 focus:outline-none"
          />
        </section>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Polyline presets
          </h3>
          <div class="flex gap-2">
            <button
              v-for="preset in polylinePresetKeys"
              :key="preset"
              class="flex-1 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition"
              :class="activePolylinePreset === preset
                ? 'border-slate-200 bg-slate-100 text-slate-900'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'"
              type="button"
              @click="applyPolylinePreset(preset)"
            >
              {{ preset }}
            </button>
          </div>
        </section>

        <section class="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Polygon presets
          </h3>
          <div class="flex gap-2">
            <button
              v-for="preset in polygonPresetKeys"
              :key="preset"
              class="flex-1 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition"
              :class="activePolygonPreset === preset
                ? 'border-slate-200 bg-slate-100 text-slate-900'
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
  </div>
</template>
