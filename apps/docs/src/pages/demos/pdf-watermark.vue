<script setup lang="ts">
import type { DemoCardSlug } from './cards'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DemoPageIntro from '@/components/demos/DemoPageIntro.vue'
import PdfWatermarkDemo from '@/components/demos/PdfWatermarkDemo.vue'
import { buildCanonicalUrl, usePageSeo } from '@/seo'
import { demoCards } from './cards'

const slug: DemoCardSlug = 'pdfWatermark'
const definition = demoCards.find(entry => entry.slug === slug)

if (!definition) {
  throw new Error('Missing demo card metadata for /demos/pdf-watermark')
}

const { t } = useI18n()

const card = computed(() => ({
  ...definition,
  title: t(definition.titleKey),
  description: t(definition.descriptionKey),
  tags: (definition.tagKeys ?? []).map(tag => t(`demos.tags.${tag}`)),
  helper: t(`demos.detail.helpers.${slug}`),
}))

usePageSeo({
  title: () => card.value.title,
  description: () => card.value.description,
  canonicalPath: definition.to,
  keywords: () => card.value.tags,
  structuredData: () => ({
    '@type': 'TechArticle',
    'name': card.value.title,
    'headline': card.value.title,
    'description': card.value.description,
    'url': buildCanonicalUrl(definition.to),
  }),
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-10 px-2 pb-16 sm:px-4 lg:px-0">
    <DemoPageIntro
      :title="card.title"
      :description="card.description"
      :helper="card.helper"
      :tags="card.tags"
    />
    <PdfWatermarkDemo />
    <section class="rounded-3xl border border-(--fp-border-color) bg-(--fp-panel-bg) p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-3">
          <p class="text-sm font-semibold text-(--fp-text-primary)">
            {{ t('demos.detail.pdfWatermarkStack.title') }}
          </p>
          <p class="text-sm text-(--fp-text-muted)">
            {{ t('demos.detail.pdfWatermarkStack.lede') }}
          </p>
          <ul class="space-y-2 text-sm text-(--fp-text-muted)">
            <li>
              {{ t('demos.detail.pdfWatermarkStack.points.orderedInsert') }}
            </li>
            <li>
              {{ t('demos.detail.pdfWatermarkStack.points.asyncImage') }}
            </li>
            <li>
              {{ t('demos.detail.pdfWatermarkStack.points.snapshot') }}
            </li>
          </ul>
        </div>
        <span class="inline-flex h-10 items-center rounded-full border border-(--fp-border-color) bg-(--fp-panel-bg-soft) px-4 text-[11px] uppercase tracking-[0.28em] text-(--fp-text-muted)">
          stack-order
        </span>
      </div>
      <div class="mt-4 rounded-2xl border border-(--fp-border-color) bg-(--fp-panel-bg-soft) p-4 text-xs text-(--fp-text-primary) sm:text-[13px]">
        <p class="mb-2 font-semibold text-(--fp-text-primary)">
          {{ t('demos.detail.pdfWatermarkStack.snippetTitle') }}
        </p>
        <pre class="overflow-auto whitespace-pre-wrap text-(--fp-text-muted)">
<code>&lt;FabricCanvas&gt;
  &lt;FabricImage :stack-order=&quot;1&quot; v-model=&quot;pdfLayer&quot; preset=&quot;overlay&quot; /&gt;
  &lt;FabricText :stack-order=&quot;2&quot; v-model=&quot;watermarkSkuText&quot; /&gt;
  &lt;FabricText :stack-order=&quot;3&quot; v-model=&quot;watermarkOrderText&quot; /&gt;
&lt;/FabricCanvas&gt;</code>
        </pre>
      </div>
    </section>
  </div>
</template>
