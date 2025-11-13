<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { computed, ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText } from 'vue-fabric-fiber'

const heroImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
  width: 960,
  height: 540,
  selectable: false,
  hasControls: false,
})

const headline = ref<FabricTextModelValue>({
  text: 'Canvas playground',
  left: 120,
  top: 120,
  fontSize: 70,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#f8fafc',
  selectable: false,
})

const tagline = ref<FabricTextModelValue>({
  text: 'Tweak hero copy directly inside the REPL.',
  left: 120,
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
  <component :is="canvasComponent" :key="canvasKey" :canvas-options="canvasOptions">
    <FabricImage v-model="heroImage" preset="background" />
    <FabricText v-model="headline" />
    <FabricText v-model="tagline" />
  </component>
</template>
