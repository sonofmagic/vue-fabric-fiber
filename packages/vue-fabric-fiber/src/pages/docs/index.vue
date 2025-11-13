<script setup lang="ts">
import type { DocsSection, RichText } from '@/types/docs'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DocsFloatingToc from '@/components/docs/DocsFloatingToc.vue'
import DocsRichText from '@/components/docs/DocsRichText.vue'
import ShikiCodeBlock from '@/components/docs/ShikiCodeBlock.vue'
import { buildCanonicalUrl, usePageSeo } from '@/seo'

const { t, tm } = useI18n()

const sections = computed(() => tm('docs.sections') as DocsSection[])

function getRichTextKey(value: RichText) {
  return value.map(segment => `${segment.type}:${segment.value}`).join('|')
}

usePageSeo({
  title: () => t('docs.meta.title'),
  description: () => t('docs.meta.description'),
  canonicalPath: '/docs',
  keywords: () => tm('docs.meta.keywords') as string[],
  structuredData: () => ({
    '@type': 'TechArticle',
    'name': t('docs.hero.title'),
    'url': buildCanonicalUrl('/docs'),
    'headline': t('docs.hero.title'),
    'description': t('docs.hero.description'),
  }),
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
    <div class="flex min-w-0 flex-1 flex-col gap-12">
      <section class="relative overflow-hidden rounded-[32px] surface-panel px-6 py-12 sm:px-10">
        <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div class="relative space-y-6">
          <span class="eyebrow">{{ t('docs.hero.eyebrow') }}</span>
          <h1 class="text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            {{ t('docs.hero.title') }}
          </h1>
          <p class="max-w-3xl text-sm leading-relaxed text-secondary sm:text-base">
            {{ t('docs.hero.description') }}
          </p>

          <div class="rounded-2xl border border-panel-soft bg-panel-soft p-4">
            <p class="text-[11px] uppercase tracking-[0.32em] text-dim">
              {{ t('docs.hero.quickLinksLabel') }}
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
              <a
                v-for="section in sections"
                :key="section.id"
                :href="`#${section.id}`"
                class="rounded-full border border-panel bg-panel-soft px-3 py-1 text-[11px] tracking-[0.12em] text-secondary transition hover:border-cyan-400/70 hover:text-primary"
              >
                {{ section.title }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="scroll-mt-28 rounded-[28px] border border-panel bg-panel p-6 sm:p-8"
      >
        <div class="space-y-5">
          <span class="text-[10px] tracking-[0.2em] text-dim">{{ section.id }}</span>
          <div class="space-y-3">
            <h2 class="text-2xl font-semibold text-primary">
              {{ section.title }}
            </h2>
            <DocsRichText
              class="text-sm leading-relaxed text-secondary"
              tag="p"
              :value="section.description"
            />
          </div>

          <div v-if="section.apiList?.length" class="flex flex-wrap gap-2">
            <span
              v-for="api in section.apiList"
              :key="api"
              class="rounded-full border border-panel bg-panel-soft px-3 py-1 text-[11px] tracking-[0.12em] text-muted"
            >
              {{ api }}
            </span>
          </div>

          <ul class="space-y-2 text-sm leading-relaxed text-secondary">
            <li v-for="point in section.points" :key="getRichTextKey(point)" class="flex gap-2">
              <span aria-hidden="true" class="mt-1 text-cyan-400">•</span>
              <DocsRichText class="flex-1" :value="point" />
            </li>
          </ul>

          <ShikiCodeBlock
            v-if="section.code"
            :code="section.code"
            :lang="section.codeLang"
            :title="section.codeTitle"
          />

          <div v-if="section.footnotes?.length" class="space-y-2 rounded-2xl border border-panel-soft bg-panel-soft p-4 text-xs text-muted">
            <DocsRichText
              v-for="note in section.footnotes"
              :key="getRichTextKey(note)"
              tag="p"
              :value="note"
            />
          </div>
        </div>
      </section>
    </div>

    <DocsFloatingToc :sections="sections" />
  </div>
</template>
