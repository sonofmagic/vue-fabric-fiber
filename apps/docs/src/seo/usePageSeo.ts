import type { MaybeRefOrGetter } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { computed, unref } from 'vue'
import { useRoute } from 'vue-router'
import {
  buildCanonicalUrl,
  DEFAULT_KEYWORDS,
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  DEFAULT_TITLE,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  THEME_COLOR,
} from './config'

export interface PageSeoOptions {
  title?: MaybeRefOrGetter<string | undefined>
  description?: MaybeRefOrGetter<string | undefined>
  canonicalPath?: MaybeRefOrGetter<string | undefined>
  image?: MaybeRefOrGetter<string | undefined>
  imageAlt?: MaybeRefOrGetter<string | undefined>
  keywords?: MaybeRefOrGetter<readonly string[] | undefined>
  noindex?: MaybeRefOrGetter<boolean | undefined>
  structuredData?: MaybeRefOrGetter<Record<string, unknown> | undefined>
}

function toValue<T>(input: MaybeRefOrGetter<T>): T {
  return typeof input === 'function' ? (input as () => T)() : unref(input)
}

export function usePageSeo(options: PageSeoOptions = {}) {
  const route = useRoute()

  const description = computed(() => {
    const raw = options.description ? toValue(options.description) : undefined
    return raw ?? SITE_DESCRIPTION
  })

  const computedTitle = computed(() => {
    const raw = options.title ? toValue(options.title) : undefined
    return raw ? `${raw} · ${SITE_NAME}` : DEFAULT_TITLE
  })

  const canonicalUrl = computed(() => {
    const maybePath = options.canonicalPath ? toValue(options.canonicalPath) : undefined
    const basePath = maybePath ?? route.fullPath ?? route.path ?? '/'
    return buildCanonicalUrl(basePath)
  })

  const socialImage = computed(() => {
    const raw = options.image ? toValue(options.image) : undefined
    return raw ?? DEFAULT_SOCIAL_IMAGE
  })

  const socialImageAlt = computed(() => {
    const raw = options.imageAlt ? toValue(options.imageAlt) : undefined
    return raw ?? DEFAULT_SOCIAL_IMAGE_ALT
  })

  const keywords = computed(() => {
    const raw = options.keywords ? toValue(options.keywords) : undefined
    return Array.isArray(raw) && raw.length > 0 ? raw : DEFAULT_KEYWORDS
  })

  const robots = computed(() => {
    const raw = options.noindex ? toValue(options.noindex) : undefined
    return raw ? 'noindex,nofollow' : 'index,follow'
  })

  useSeoMeta({
    title: () => computedTitle.value,
    description: () => description.value,
    ogTitle: () => computedTitle.value,
    ogDescription: () => description.value,
    ogType: 'website',
    ogImage: () => socialImage.value,
    ogImageAlt: () => socialImageAlt.value,
    ogUrl: () => canonicalUrl.value,
    ogSiteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    twitterTitle: () => computedTitle.value,
    twitterDescription: () => description.value,
    twitterImage: () => socialImage.value,
    twitterImageAlt: () => socialImageAlt.value,
    robots: () => robots.value,
    author: SITE_AUTHOR,
    keywords: () => keywords.value.join(', '),
  })

  useHead(() => {
    const ldJson = options.structuredData ? toValue(options.structuredData) : undefined

    return {
      link: [
        {
          rel: 'canonical',
          href: canonicalUrl.value,
        },
      ],
      meta: [
        {
          name: 'theme-color',
          content: THEME_COLOR,
        },
      ],
      script: ldJson
        ? [
            {
              key: 'ld-json',
              type: 'application/ld+json',
              children: JSON.stringify({
                '@context': 'https://schema.org',
                ...ldJson,
              }),
            },
          ]
        : undefined,
    }
  })
}
