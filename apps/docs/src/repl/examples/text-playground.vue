<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { computed, ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText } from 'vue-fabric-fiber'

const heroImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
  width: 960,
  height: 540,
  selectable: false,
  hasControls: false,
})

const headline = ref<FabricTextModelValue>({
  text: 'Typography playground',
  left: 110,
  top: 120,
  fontSize: 68,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#f8fafc',
  selectable: false,
})

const tagline = ref<FabricTextModelValue>({
  text: 'Adjust spacing, weight, and colors on the fly.',
  left: 110,
  top: 240,
  fontSize: 30,
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
  <component :is="canvasComponent" :key="canvasKey" :canvas-options="canvasOptions">
    <FabricImage v-model="heroImage" preset="background" />
    <FabricText v-model="headline" />
    <FabricText v-model="tagline" />
  </component>
</template>
