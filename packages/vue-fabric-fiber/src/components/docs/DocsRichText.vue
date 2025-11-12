<script setup lang="ts">
import type { RichText } from '@/types/docs'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: RichText
    tag?: keyof HTMLElementTagNameMap
  }>(),
  {
    tag: 'span',
  },
)

const tag = computed(() => props.tag ?? 'span')
</script>

<template>
  <component :is="tag" v-bind="$attrs">
    <template v-for="(segment, index) in value" :key="index">
      <code
        v-if="segment.type === 'code'"
        class="rounded-md bg-slate-800/80 px-1 py-0.5 font-mono text-[0.85em] text-slate-100"
      >{{ segment.value }}</code>
      <template v-else>
        {{ segment.value }}
      </template>
    </template>
  </component>
</template>
