<script setup lang="ts">
import type { FabricCanvasOptions } from 'vue-fabric-fiber'
import * as fabric from 'fabric'
import {
  computed,
  onBeforeUnmount,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { FabricCanvas } from 'vue-fabric-fiber'

type AnimationDirection = 'up' | 'down'

interface PaletteOption {
  id: string
  label: string
  background: string
  colors: string[]
}

class Cross extends fabric.FabricObject {
  animDirection: AnimationDirection = 'up'
  w1 = 100
  h1 = 30
  w2 = 30
  h2 = 100

  constructor(options: Partial<fabric.FabricObjectProps> = {}) {
    super({
      ...options,
    })
    this.transparentCorners = false
    this.objectCaching = false
    this.type = 'cross'
    this.set({
      originX: 'center',
      originY: 'center',
      hasBorders: false,
      hasControls: false,
    })
    this.width = 100
    this.height = 100
    this.reset()
  }

  reset() {
    this.animDirection = 'up'
    this.w1 = this.h2 = 100
    this.h1 = this.w2 = 30
  }

  animateWidthHeight(multiplier = 1) {
    if (!Number.isFinite(multiplier) || multiplier <= 0) {
      return
    }
    const interval = 2 * multiplier

    if (this.h2 >= 30 && this.h2 <= 100) {
      const actualInterval = this.animDirection === 'up' ? interval : -interval
      this.h2 += actualInterval
      this.w1 += actualInterval
    }

    if (this.h2 >= 100) {
      this.animDirection = 'down'
      this.h2 -= interval
      this.w1 -= interval
    }

    if (this.h2 <= 30) {
      this.animDirection = 'up'
      this.h2 += interval
      this.w1 += interval
    }
  }

  _render(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(-this.w1 / 2, -this.h1 / 2, this.w1, this.h1)
    ctx.fillRect(-this.w2 / 2, -this.h2 / 2, this.w2, this.h2)
  }
}

function isCross(object: fabric.FabricObject): object is Cross {
  return typeof (object as Cross).animateWidthHeight === 'function'
    && (object as Cross).type === 'cross'
}

const CROSS_POSITIONS = [
  { top: 100, left: 100 },
  { top: 140, left: 230 },
  { top: 300, left: 210 },
  { top: 40, left: 400 },
  { top: 450, left: 400 },
] as const

const paletteOptions: PaletteOption[] = [
  {
    id: 'aurora',
    label: 'Aurora night',
    background: '#041023',
    colors: ['#64ffda', '#80ffea', '#f865c6', '#ff9f1c', '#f9bc60'],
  },
  {
    id: 'sunset',
    label: 'Sunset glow',
    background: '#fff7ed',
    colors: ['#fb923c', '#f97316', '#facc15', '#f87171', '#f5d0c5'],
  },
  {
    id: 'mono',
    label: 'Monochrome',
    background: '#f8fafc',
    colors: ['#0f172a'],
  },
]

type PaletteId = (typeof paletteOptions)[number]['id']

if (paletteOptions.length === 0) {
  throw new Error('paletteOptions must define at least one palette')
}

const defaultPalette: PaletteOption = paletteOptions[0]!

const canvasOptions = reactive<FabricCanvasOptions>({
  width: 600,
  height: 500,
  preserveObjectStacking: true,
  selection: false,
  backgroundColor: defaultPalette.background,
})

const canvasOptionsBinding = computed<FabricCanvasOptions>(() => ({
  width: canvasOptions.width,
  height: canvasOptions.height,
  preserveObjectStacking: canvasOptions.preserveObjectStacking,
  selection: canvasOptions.selection,
  backgroundColor: canvasOptions.backgroundColor,
}))

const activePaletteId = ref<PaletteId>(defaultPalette.id)
const speed = ref(1)
const isRunning = ref(true)

const activePalette = computed(() => {
  return paletteOptions.find(option => option.id === activePaletteId.value) ?? defaultPalette
})

const fabricCanvas = shallowRef<fabric.Canvas>()
let animationFrame: number | null = null

function stopLoop() {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

function runAnimation() {
  const canvas = fabricCanvas.value
  if (!canvas) {
    animationFrame = null
    return
  }

  canvas.forEachObject((object) => {
    if (isCross(object)) {
      object.animateWidthHeight(speed.value)
    }
  })

  canvas.requestRenderAll()
  animationFrame = requestAnimationFrame(runAnimation)
}

function startLoop() {
  stopLoop()
  animationFrame = requestAnimationFrame(runAnimation)
}

function refreshPaletteColors() {
  const canvas = fabricCanvas.value
  const palette = activePalette.value
  if (!canvas) {
    return
  }

  const colors = palette.colors.length > 0 ? palette.colors : ['#0f172a']
  let index = 0

  canvas.forEachObject((object) => {
    if (!isCross(object)) {
      return
    }
    const color = colors[index % colors.length]
    object.set('fill', color)
    index += 1
  })

  canvas.requestRenderAll()
}

function handleReady(canvas: fabric.Canvas) {
  fabricCanvas.value = canvas

  CROSS_POSITIONS.forEach((position) => {
    const cross = new Cross({
      left: position.left,
      top: position.top,
      selectable: false,
      evented: false,
    })
    canvas.add(cross)
  })

  refreshPaletteColors()
  if (isRunning.value) {
    startLoop()
  }
}

function toggleAnimation() {
  if (!fabricCanvas.value) {
    return
  }
  isRunning.value = !isRunning.value
}

function resetCrosses() {
  const canvas = fabricCanvas.value
  if (!canvas) {
    return
  }

  canvas.forEachObject((object) => {
    if (isCross(object)) {
      object.reset()
    }
  })

  canvas.requestRenderAll()
}

watch(isRunning, (running) => {
  if (!fabricCanvas.value) {
    return
  }
  if (running) {
    startLoop()
  }
  else {
    stopLoop()
  }
})

watch(activePalette, (palette) => {
  canvasOptions.backgroundColor = palette.background
  refreshPaletteColors()
})

watch(speed, (value) => {
  if (value < 0.4) {
    speed.value = 0.4
  }
})

onBeforeUnmount(() => {
  stopLoop()
})
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-10">
    <section class="rounded-[32px] surface-panel px-6 py-10 sm:px-10">
      <span class="eyebrow">Fabric.js official demo</span>
      <h1 class="mt-4 text-3xl font-semibold text-primary sm:text-4xl">
        Animating crosses
      </h1>
      <p class="mt-4 max-w-3xl text-sm leading-relaxed text-secondary sm:text-base">
        This recreation ports Fabric.js’ <span class="font-medium text-primary">animating crosses</span> example into the
        vue-fabric-fiber component model. Each cross inherits from <code>fabric.FabricObject</code>, animating its arms with
        requestAnimationFrame while keeping Fabric’s render cycle hot.
      </p>
    </section>

    <div class="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div class="relative overflow-hidden rounded-[32px] surface-panel p-6 sm:p-8">
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div class="relative overflow-hidden rounded-3xl border border-panel bg-panel-strong shadow-[0_36px_90px_-48px_rgba(15,23,42,0.9)]">
          <FabricCanvas
            :canvas-options="canvasOptionsBinding"
            :auto-resize="false"
            @ready="handleReady"
          />
        </div>
      </div>

      <aside class="surface-panel-muted flex flex-col gap-6 rounded-[32px] p-6 text-sm text-primary sm:p-7">
        <section class="space-y-2">
          <span class="eyebrow">Controls</span>
          <h2 class="text-lg font-semibold text-primary">
            Animation settings
          </h2>
          <p class="text-xs leading-relaxed text-muted">
            Tune the cross animation by adjusting speed, switching palettes, or resetting the arms. The canvas keeps the Fabric
            render loop reactive.
          </p>
        </section>

        <section class="space-y-3 rounded-2xl border border-panel bg-panel p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            Playback
          </h3>
          <button
            class="w-full rounded-xl border border-panel bg-panel px-4 py-2 text-xs font-medium text-primary-soft transition hover:border-panel-strong hover:bg-input"
            type="button"
            @click="toggleAnimation"
          >
            {{ isRunning ? 'Pause animation' : 'Resume animation' }}
          </button>
          <label class="flex flex-col gap-2 rounded-xl border border-panel-soft bg-panel px-4 py-3 text-xs text-primary-soft">
            <span class="flex items-center justify-between">
              Speed
              <span class="font-semibold text-primary">{{ speed.toFixed(1) }}×</span>
            </span>
            <input
              v-model.number="speed"
              class="accent-cyan-400"
              max="3"
              min="0.4"
              step="0.1"
              type="range"
            >
          </label>
          <button
            class="w-full rounded-xl border border-panel bg-panel px-4 py-2 text-xs font-medium text-primary-soft transition hover:border-panel-strong hover:bg-input"
            type="button"
            @click="resetCrosses"
          >
            Reset crosses
          </button>
        </section>

        <section class="space-y-3 rounded-2xl border border-panel bg-panel p-4">
          <h3 class="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            Color palette
          </h3>
          <div class="flex flex-col gap-3">
            <button
              v-for="palette in paletteOptions"
              :key="palette.id"
              class="flex items-center justify-between rounded-xl border px-4 py-3 text-xs transition" :class="[
                activePaletteId === palette.id
                  ? 'border-cyan-400/70 bg-cyan-400/10 text-primary'
                  : 'border-panel bg-panel text-secondary hover:border-panel-strong hover:bg-input',
              ]"
              type="button"
              @click="activePaletteId = palette.id"
            >
              <span class="font-medium">{{ palette.label }}</span>
              <span class="flex items-center gap-1">
                <span
                  v-for="color in palette.colors"
                  :key="color"
                  :style="{ backgroundColor: color }"
                  class="h-4 w-4 rounded-full border border-white/20"
                />
              </span>
            </button>
          </div>
        </section>

        <section class="space-y-2 rounded-2xl border border-panel bg-panel p-4 text-xs text-secondary">
          <p>
            <code>Cross</code> reuses Fabric&apos;s object lifecycle – the component only needs to add instances during
            <code>@ready</code>. The animation itself runs outside Vue reactivity, relying on Fabric&apos;s render queue for smooth
            updates.
          </p>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.accent-cyan-400 {
  accent-color: #22d3ee;
}
</style>
