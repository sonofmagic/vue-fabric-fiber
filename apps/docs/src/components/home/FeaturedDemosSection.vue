<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

interface FeaturedSectionProps {
  featuredDemos: Array<{ to: string, title: string, description: string }>
}

defineProps<FeaturedSectionProps>()

const { t } = useI18n()
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span class="eyebrow">{{ t('home.hero.featured.eyebrow') }}</span>
        <h2 class="mt-3 text-2xl font-semibold text-primary">
          {{ t('home.hero.featured.title') }}
        </h2>
      </div>
      <div class="flex flex-col gap-3 text-xs leading-relaxed text-muted sm:text-sm">
        <p class="max-w-xl">
          {{ t('home.hero.featured.description') }}
        </p>
        <RouterLink
          class="group inline-flex w-fit items-center gap-2 rounded-full border border-panel-strong bg-panel px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-soft transition hover:border-panel-strong hover:text-primary"
          to="/demos"
        >
          {{ t('app.actions.viewAllDemos') }}
          <span aria-hidden="true" class="transition group-hover:translate-x-0.5">→</span>
        </RouterLink>
      </div>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <RouterLink
        v-for="route in featuredDemos"
        :key="route.to"
        :to="route.to"
        class="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-panel bg-panel p-6 transition hover:-translate-y-1 hover:border-panel-strong hover:bg-panel"
      >
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 transition group-hover:opacity-100" />
        <div class="relative space-y-3">
          <h3 class="text-lg font-medium text-primary">
            {{ route.title }}
          </h3>
          <p class="text-xs leading-relaxed text-muted">
            {{ route.description }}
          </p>
        </div>
        <span class="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted transition group-hover:text-primary">
          {{ t('app.actions.viewDemo') }}
          <span aria-hidden="true" class="transition group-hover:translate-x-1">→</span>
        </span>
      </RouterLink>
    </div>
  </section>
</template>
