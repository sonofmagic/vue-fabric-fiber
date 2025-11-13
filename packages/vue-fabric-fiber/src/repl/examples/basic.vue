<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { computed, ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText } from 'vue-fabric-fiber'

const heroImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1529280458970-8da337920c90?auto=format&fit=crop&w=1280&q=80',
  width: 960,
  height: 540,
  selectable: false,
  hasControls: false,
})

const headline = ref<FabricTextModelValue>({
  text: 'Design a marketing hero in real time',
  left: 110,
  top: 120,
  fontSize: 72,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#f8fafc',
  selectable: false,
})

const tagline = ref<FabricTextModelValue>({
  text: 'Swap imagery and typography while the canvas stays reactive.',
  left: 110,
  top: 240,
  fontSize: 32,
  fontFamily: 'Inter',
  fontWeight: '500',
  fill: '#cbd5f5',
  selectable: false,
})

const canvasComponent = computed(() => FabricCanvas)
const canvasKey = ref(0)

const canvasOptions = computed(() => ({
  width: 960,
  height: 540,
  preserveObjectStacking: true,
}))
</script>

<template>
  <div>
  <component :is="canvasComponent" :key="canvasKey" :canvas-options="canvasOptions">
      <FabricImage v-model="heroImage" preset="background" />
      <FabricText v-model="headline" />
      <FabricText v-model="tagline" />
    </component>
  </div>
</template>
