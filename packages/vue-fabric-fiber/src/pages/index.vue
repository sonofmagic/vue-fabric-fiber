<script setup lang="ts">
import { ref } from 'vue'
import { FabricCanvas, FabricImage, FabricText, RenderGroup } from '~/index'

const textArray = ref([
  {
    text: 'Hello World',
    left: 100,
    top: 100,
    fontSize: 100,
    fill: 'white',
  },
  {
    text: 'Hello World',
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
        <FabricImage src="https://picsum.photos/800/800" width="800" :has-controls="false" :selectable="false" />
        <template v-for="(_, idx) in textArray" :key="idx">
          <FabricText v-model="textArray[idx]" />
        </template>

        <RenderGroup>
          <FabricText
            :model-value="{ text: '我在后面',
                            left: 400,
                            top: 400,
                            fontSize: 100,
                            fill: 'red' }"
          />
          <FabricImage src="https://picsum.photos/200/200" :width="200" :left="400" :top="400" />
          <FabricText
            :model-value="{ text: '你好',
                            left: 400,
                            top: 400,
                            fontSize: 50,
                            fill: 'white' }"
          />
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
