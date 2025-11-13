<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { computed, ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText } from 'vue-fabric-fiber'

const heroImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1502767089025-6572583495b0?auto=format&fit=crop&w=1400&q=80',
  width: 960,
  height: 540,
  selectable: false,
  hasControls: false,
})

const headline = ref<FabricTextModelValue>({
  text: 'Composite overlays',
  left: 110,
  top: 110,
  fontSize: 70,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#fefce8',
  selectable: false,
})

const tagline = ref<FabricTextModelValue>({
  text: 'Blend gradients, photos, and copy in one stack.',
  left: 110,
  top: 220,
  fontSize: 30,
  fontFamily: 'Inter',
  fontWeight: '500',
  fill: '#fde68a',
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
  <component :is="canvasComponent" :key="canvasKey" :canvas-options="canvasOptions">
    <FabricImage v-model="heroImage" preset="background" />
    <FabricText v-model="headline" />
    <FabricText v-model="tagline" />
  </component>
</template>
