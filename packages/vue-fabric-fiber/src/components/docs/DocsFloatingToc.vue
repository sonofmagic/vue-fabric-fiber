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
  <aside class="docs-toc hidden text-xs lg:sticky lg:top-24 lg:block lg:self-start">
    <div class="flex flex-col gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4">
      <p class="text-[11px] tracking-[0.28em] text-slate-500">
        TOC
      </p>
      <nav class="flex flex-col gap-2">
        <button
          v-for="section in sections"
          :key="section.id"
          class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition"
          :class="activeId === section.id
            ? 'bg-slate-900 text-slate-100 shadow-[0_18px_36px_-22px_rgba(15,23,42,0.9)]'
            : 'text-slate-400 hover:text-slate-100'"
          type="button"
          @click="scrollToSection(section.id)"
        >
          <span class="truncate text-[11px] tracking-[0.12em]">
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
</style>
