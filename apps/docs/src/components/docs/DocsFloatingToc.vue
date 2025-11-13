<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface TocSection {
  id: string
  title: string
}

const props = defineProps<{ sections: TocSection[] }>()

const activeId = ref(props.sections[0]?.id ?? '')
let observer: IntersectionObserver | null = null

function setActive(id?: string) {
  if (id) {
    activeId.value = id
  }
}

function cleanupObserver() {
  observer?.disconnect()
  observer = null
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) {
    return
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function setupObserver() {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return
  }

  cleanupObserver()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          setActive(entry.target.id)
        }
      })
    },
    {
      root: null,
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0,
    },
  )

  props.sections.forEach((section) => {
    const el = document.getElementById(section.id)
    if (el) {
      observer?.observe(el)
    }
  })
}

function initObserver() {
  nextTick(() => {
    setupObserver()
  })
}

watch(
  () => props.sections,
  () => {
    initObserver()
  },
  { deep: true },
)

onMounted(() => {
  initObserver()
})

onBeforeUnmount(() => {
  cleanupObserver()
})
</script>

<template>
  <aside class="docs-toc hidden text-xs lg:sticky lg:top-28 lg:block lg:self-start">
    <div class="flex flex-col gap-4 rounded-2xl border border-panel bg-panel-strong p-4">
      <p class="text-[11px] tracking-[0.28em] text-dim">
        TOC
      </p>
      <nav class="flex flex-col gap-2">
        <button
          v-for="section in sections"
          :key="section.id"
          class="docs-toc-link flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11px] tracking-[0.12em]"
          :class="{ 'docs-toc-link--active': activeId === section.id }"
          type="button"
          @click="scrollToSection(section.id)"
        >
          <span class="truncate">
            {{ section.title }}
          </span>
          <span v-if="activeId === section.id" aria-hidden="true" class="text-cyan-300">•</span>
        </button>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.docs-toc {
  min-width: 240px;
}

.docs-toc-link {
  color: var(--fp-text-muted);
  background-color: transparent;
  border: 1px solid transparent;
  transition: color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.docs-toc-link:hover {
  color: var(--fp-text-primary);
  background-color: var(--fp-chip-bg);
}

.docs-toc-link--active {
  color: var(--fp-text-primary);
  background-color: var(--fp-panel-bg-soft);
  border-color: var(--fp-border-color);
  box-shadow: var(--fp-panel-muted-shadow);
}

:global(:root[data-theme='light']) .docs-toc-link:hover {
  background-color: rgb(15 23 42 / 8%);
  box-shadow: 0 12px 32px -22px rgb(15 23 42 / 25%);
}

:global(:root[data-theme='light']) .docs-toc-link--active {
  background-color: rgb(148 163 184 / 15%);
  box-shadow: 0 18px 42px -28px rgb(15 23 42 / 30%);
}
</style>
