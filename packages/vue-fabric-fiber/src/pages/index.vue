<script setup lang="ts">
import { FabricCanvas } from '~/FabricCanvas'
import { FabricText } from '~/FabricText'
</script>

<template>
  <div>
    <FabricCanvas class="canvas">
      <FabricText content="Hello World" :left="100" :top="100" :fontSize="20" fill="red" />
    </FabricCanvas>
  </div>
</template>

<style scoped>
.canvas {
  width: 500px;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
