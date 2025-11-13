<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  helper: string
  tags: string[]
}>()
</script>

<template>
  <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-8 sm:px-10">
    <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
    <div class="relative space-y-6">
      <span class="eyebrow">{{ $t('demos.detail.common.eyebrow') }}</span>
      <div class="space-y-4">
        <h1 class="text-3xl font-semibold text-primary">
          {{ props.title }}
        </h1>
        <p class="max-w-3xl text-sm leading-relaxed text-secondary">
          {{ props.description }}
        </p>
        <p class="max-w-3xl text-xs leading-relaxed text-muted">
          {{ props.helper }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in props.tags"
          :key="tag"
          class="rounded-full border border-panel bg-panel-soft px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-muted"
        >
          {{ tag }}
        </span>
      </div>
      <slot />
    </div>
  </section>
</template>
