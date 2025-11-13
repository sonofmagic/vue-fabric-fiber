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
        class="docs-inline-code rounded-md px-1 py-0.5 font-mono text-[0.85em]"
      >{{ segment.value }}</code>
      <template v-else>
        {{ segment.value }}
      </template>
    </template>
  </component>
</template>

<style scoped>
.docs-inline-code {
  color: var(--fp-text-primary);
  background-color: var(--fp-chip-bg);
  border: 1px solid var(--fp-chip-border);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 8%);
}

:global(:root[data-theme='light']) .docs-inline-code {
  color: var(--fp-text-secondary);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 40%);
}
</style>
