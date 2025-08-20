<script setup lang="ts">
import { ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText, RenderGroup } from '~/index'

const textArray = ref([
  {
    content: 'Hello World',
    left: 100,
    top: 100,
    fontSize: 20,
    fill: 'red',
  },
  {
    content: 'Hello World',
    left: 200,
    top: 300,
    fontSize: 50,
    fill: 'blue',
  },
])
</script>

<template>
  <div class="flex justify-center">
    <div>
      <FabricCanvas class="w-200 h-200 border">
        <FabricImage src="https://picsum.photos/200/200" :width="400" />
        <FabricText v-for="(props, idx) in textArray" :key="idx" v-bind="props" />
        <RenderGroup>
          <FabricImage src="https://picsum.photos/200/200" :width="200" :left="400" :top="400" />
          <FabricText v-for="(props, idx) in textArray" :key="idx" v-bind="props" :left="props.left + 150" :top="props.top + 100" />
        </RenderGroup>
      </FabricCanvas>
    </div>
    <div>
      <pre>
{{ textArray }}
      </pre>
    </div>
  </div>
</template>
