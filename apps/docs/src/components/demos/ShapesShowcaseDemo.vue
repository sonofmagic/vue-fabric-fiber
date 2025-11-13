<script setup lang="ts">
import type {
  FabricCircleModelValue,
  FabricPathModelValue,
  FabricPolygonModelValue,
  FabricPolylineModelValue,
  FabricRectModelValue,
  FabricTextModelValue,
} from 'vue-fabric-fiber'
import { ref } from 'vue'
import { FabricCanvas, FabricCircle, FabricPath, FabricPolygon, FabricPolyline, FabricRect, FabricText } from 'vue-fabric-fiber'

const palette = ['#38bdf8', '#f472b6', '#fbbf24', '#22d3ee', '#a78bfa']

const headline = ref<FabricTextModelValue>({
  text: 'Shape toolkit',
  left: 120,
  top: 70,
  fontSize: 56,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#f8fafc',
  selectable: false,
  hasControls: false,
})

const rectShape = ref<FabricRectModelValue>({
  left: 120,
  top: 180,
  width: 220,
  height: 140,
  rx: 32,
  ry: 32,
  angle: -6,
  fill: palette[0],
  opacity: 0.9,
})

const circleShape = ref<FabricCircleModelValue>({
  left: 430,
  top: 140,
  radius: 90,
  fill: palette[1],
  opacity: 0.85,
})

const polygonShape = ref<FabricPolygonModelValue>({
  left: 640,
  top: 210,
  points: [
    { x: 0, y: 140 },
    { x: 80, y: 40 },
    { x: 200, y: 0 },
    { x: 260, y: 120 },
    { x: 160, y: 220 },
    { x: 20, y: 220 },
  ],
  fill: 'rgba(250,204,21,0.18)',
  stroke: '#fbbf24',
  strokeWidth: 4,
})

const polylineShape = ref<FabricPolylineModelValue>({
  left: 140,
  top: 360,
  points: [
    { x: 0, y: 80 },
    { x: 80, y: 10 },
    { x: 140, y: 90 },
    { x: 200, y: 20 },
    { x: 260, y: 110 },
  ],
  stroke: '#32d399',
  strokeWidth: 10,
  fill: '',
  strokeLineCap: 'round',
  strokeLineJoin: 'round',
})

const pathShape = ref<FabricPathModelValue>({
  left: 420,
  top: 360,
  path: 'M 0 40 Q 60 -20 120 40 T 240 40',
  stroke: '#a78bfa',
  strokeWidth: 8,
  fill: '',
  strokeLineCap: 'round',
})

function randomColor() {
  return palette[Math.floor(Math.random() * palette.length)]
}

function randomizeShapes() {
  rectShape.value.fill = randomColor()
  rectShape.value.left = 80 + Math.random() * 140
  rectShape.value.top = 160 + Math.random() * 60
  rectShape.value.angle = -10 + Math.random() * 20

  circleShape.value.fill = randomColor()
  circleShape.value.left = 360 + Math.random() * 160
  circleShape.value.top = 120 + Math.random() * 80

  polygonShape.value.stroke = randomColor()
  polygonShape.value.left = 580 + Math.random() * 80
  polygonShape.value.top = 200 + Math.random() * 60

  polylineShape.value.stroke = randomColor()
  pathShape.value.stroke = randomColor()
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-[28px] border border-panel bg-panel p-3 sm:p-4">
      <div class="canvas-shell aspect-[16/9] overflow-hidden rounded-[24px] border border-panel-soft bg-overlay-strong">
        <FabricCanvas :canvas-options="{ width: 980, height: 540, preserveObjectStacking: true, backgroundColor: '#020617' }">
          <FabricText v-model="headline" />
          <FabricRect v-model="rectShape" />
          <FabricCircle v-model="circleShape" />
          <FabricPolygon v-model="polygonShape" />
          <FabricPolyline v-model="polylineShape" />
          <FabricPath v-model="pathShape" />
        </FabricCanvas>
      </div>
    </div>

    <section class="rounded-[24px] border border-panel bg-panel-soft p-4 text-[13px] text-primary">
      <div class="space-y-2">
        <span class="eyebrow">Primitives</span>
        <p class="text-sm text-muted">
          Rectangles, circles, polygons, polylines, and custom paths all share the same v-model contract.
        </p>
      </div>
      <button type="button" class="mt-4 inline-flex items-center rounded-full border border-panel px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-muted transition hover:text-primary" @click="randomizeShapes">
        Randomize palette
      </button>
    </section>
  </div>
</template>
