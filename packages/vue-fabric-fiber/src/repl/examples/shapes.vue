<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { computed, ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText } from 'vue-fabric-fiber'

const heroImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80',
  width: 960,
  height: 540,
  selectable: false,
  hasControls: false,
})

const headline = ref<FabricTextModelValue>({
  text: 'Shape library',
  left: 120,
  top: 110,
  fontSize: 72,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#f8fafc',
  selectable: false,
})

const tagline = ref<FabricTextModelValue>({
  text: 'Experiment with Fabric primitives and glyphs.',
  left: 120,
  top: 230,
  fontSize: 32,
  fontFamily: 'Inter',
  fontWeight: '500',
  fill: '#38bdf8',
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
