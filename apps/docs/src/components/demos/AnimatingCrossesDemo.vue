<script setup lang="ts">
import type { FabricRectModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { FabricCanvas, FabricRect, FabricText } from 'vue-fabric-fiber'

interface CrossState {
  horizontal: ReturnType<typeof ref<FabricRectModelValue>>
  vertical: ReturnType<typeof ref<FabricRectModelValue>>
  baseLeft: number
  baseTop: number
  phase: number
}

const crossStates: CrossState[] = Array.from({ length: 4 }, (_, index) => {
  const baseLeft = 200 + index * 150
  const baseTop = 180 + (index % 2) * 90
  return {
    horizontal: ref<FabricRectModelValue>({
      left: baseLeft,
      top: baseTop,
      width: 150,
      height: 8,
      rx: 999,
      ry: 999,
      fill: '#38bdf8',
      opacity: 0.9,
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasControls: false,
    }),
    vertical: ref<FabricRectModelValue>({
      left: baseLeft,
      top: baseTop,
      width: 8,
      height: 150,
      rx: 999,
      ry: 999,
      fill: '#38bdf8',
      opacity: 0.9,
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasControls: false,
    }),
    baseLeft,
    baseTop,
    phase: index * 0.6,
  }
})

const title = ref<FabricTextModelValue>({
  text: 'Animating crosses',
  left: 80,
  top: 60,
  fontSize: 56,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#f8fafc',
  selectable: false,
  hasControls: false,
})

const subtitle = ref<FabricTextModelValue>({
  text: 'Each bar is a FabricRect bound to a reactive ref.',
  left: 80,
  top: 120,
  fontSize: 24,
  fontFamily: 'Inter',
  fontWeight: '500',
  fill: '#cbd5f5',
  selectable: false,
  hasControls: false,
})

const palette = ['#38bdf8', '#f472b6', '#f97316', '#a78bfa']
const activeColor = ref(palette[0])
const animationSpeed = ref(1.2)
const amplitude = ref(40)
let frameHandle: number | null = null

function step(timestamp: number) {
  const t = timestamp / 1000
  crossStates.forEach((cross, index) => {
    const wobble = Math.sin((t * animationSpeed.value) + cross.phase) * amplitude.value
    const rotation = (t * 80 * animationSpeed.value + index * 8) % 360
    cross.horizontal.value.left = cross.baseLeft + wobble
    cross.vertical.value.top = cross.baseTop + wobble
    cross.horizontal.value.angle = rotation
    cross.vertical.value.angle = rotation
  })
  frameHandle = window.requestAnimationFrame(step)
}

onMounted(() => {
  frameHandle = window.requestAnimationFrame(step)
})

onBeforeUnmount(() => {
  if (frameHandle !== null) {
    cancelAnimationFrame(frameHandle)
  }
})

watch(activeColor, (color) => {
  crossStates.forEach((cross) => {
    cross.horizontal.value.fill = color
    cross.vertical.value.fill = color
  })
}, { immediate: true })
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-[28px] border border-panel bg-panel p-3 sm:p-4">
      <div class="canvas-shell aspect-[16/9] overflow-hidden rounded-[24px] border border-panel-soft bg-[#030712]">
        <FabricCanvas :canvas-options="{ width: 920, height: 520, backgroundColor: '#020617', preserveObjectStacking: true }">
          <FabricText v-model="title" />
          <FabricText v-model="subtitle" />
          <template v-for="(cross, index) in crossStates" :key="`cross-${index}`">
            <FabricRect v-model="cross.horizontal.value" />
            <FabricRect v-model="cross.vertical.value" />
          </template>
        </FabricCanvas>
      </div>
    </div>

    <section class="rounded-[24px] border border-panel bg-panel-soft p-4 text-[13px] text-primary">
      <div class="space-y-2">
        <span class="eyebrow">Animation controls</span>
        <p class="text-sm text-muted">
          Rotations happen through reactive refs; no Fabric imperative calls are required once the bindings exist.
        </p>
      </div>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <div class="space-y-3">
          <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
            Speed
            <input v-model.number="animationSpeed" type="range" min="0.5" max="2.4" step="0.1">
          </label>
          <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
            Amplitude
            <input v-model.number="amplitude" type="range" min="10" max="60" step="2">
          </label>
        </div>
        <div class="space-y-3">
          <p class="text-[11px] uppercase tracking-[0.26em] text-dim">
            Palette
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in palette"
              :key="color"
              type="button"
              class="h-10 w-10 rounded-2xl border-2 border-panel transition"
              :style="{ backgroundColor: color }"
              :class="color === activeColor ? 'ring-2 ring-offset-2 ring-panel-soft' : ''"
              @click="activeColor = color"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
