<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  index: number
  title: string
  desc: string
}>()

const indexLabel = computed(() => props.index.toString())
</script>

<template>
  <div class="space-y-3 rounded-2xl border border-(--fp-border-color) bg-(--fp-panel-bg-soft) p-4 sm:p-5">
    <div class="flex items-center gap-3">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sm font-semibold text-sky-100">
        {{ indexLabel }}
      </div>
      <div class="space-y-0.5">
        <p class="text-base font-semibold text-(--fp-text-primary)">
          {{ title }}
        </p>
        <p class="text-xs text-(--fp-text-muted)">
          {{ desc }}
        </p>
      </div>
    </div>
    <slot />
  </div>
</template>
