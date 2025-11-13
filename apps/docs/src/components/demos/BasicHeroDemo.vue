<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { computed, ref, watchEffect } from 'vue'
import { FabricCanvas, FabricImage, FabricText, RenderGroup } from 'vue-fabric-fiber'

interface HeroVariant {
  id: string
  label: string
  image: string
  headlineFill: string
  taglineFill: string
  accentFill: string
}

const HERO_VARIANTS: HeroVariant[] = [
  {
    id: 'aurora',
    label: 'Aurora gradient',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
    headlineFill: '#f8fafc',
    taglineFill: '#cbd5f5',
    accentFill: '#38bdf8',
  },
  {
    id: 'sunset',
    label: 'Sunset dunes',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80',
    headlineFill: '#fefce8',
    taglineFill: '#fde68a',
    accentFill: '#fbbf24',
  },
  {
    id: 'studio',
    label: 'Studio portrait',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
    headlineFill: '#f8fafc',
    taglineFill: '#e2e8f0',
    accentFill: '#f472b6',
  },
]

const selectedVariantId = ref<HeroVariant['id']>(HERO_VARIANTS[0].id)
const selectedVariant = computed(() => HERO_VARIANTS.find(variant => variant.id === selectedVariantId.value) ?? HERO_VARIANTS[0])

const heroImage = ref<FabricImageModelValue>({
  src: HERO_VARIANTS[0].image,
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  selectable: false,
  hasControls: false,
  evented: false,
})

const headline = ref<FabricTextModelValue>({
  text: 'Direct hero art from data bindings',
  left: 120,
  top: 140,
  fontSize: 66,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: HERO_VARIANTS[0].headlineFill,
  shadow: 'rgba(2,6,23,0.48) 0px 24px 70px',
  selectable: false,
  hasControls: false,
})

const tagline = ref<FabricTextModelValue>({
  text: 'Swap imagery and typography with reactive Fabric components.',
  left: 120,
  top: 250,
  fontSize: 30,
  fontFamily: 'Inter',
  fontWeight: '500',
  fill: HERO_VARIANTS[0].taglineFill,
  width: 560,
  lineHeight: 1.4,
  selectable: false,
  hasControls: false,
})

const accentLabel = ref<FabricTextModelValue>({
  text: 'RenderGroup · FabricImage · FabricText',
  left: 120,
  top: 340,
  fontSize: 24,
  fontFamily: 'DM Sans',
  fontWeight: '600',
  fill: HERO_VARIANTS[0].accentFill,
  selectable: false,
  hasControls: false,
})

const copyInput = ref(headline.value.text)
const taglineInput = ref(tagline.value.text)
const uppercaseHeadline = ref(false)
const headlineSize = ref(66)
const charSpacing = ref(0)
const showSelection = ref(false)

watchEffect(() => {
  heroImage.value.src = selectedVariant.value.image
  headline.value.fill = selectedVariant.value.headlineFill
  tagline.value.fill = selectedVariant.value.taglineFill
  accentLabel.value.fill = selectedVariant.value.accentFill
})

watchEffect(() => {
  headline.value.fontSize = headlineSize.value
})

watchEffect(() => {
  headline.value.charSpacing = charSpacing.value
})

watchEffect(() => {
  const copy = uppercaseHeadline.value ? copyInput.value.toUpperCase() : copyInput.value
  headline.value.text = copy
})

watchEffect(() => {
  tagline.value.text = taglineInput.value
})

watchEffect(() => {
  const selectable = showSelection.value
  headline.value.selectable = selectable
  tagline.value.selectable = selectable
  accentLabel.value.selectable = selectable
})

function resetCopy() {
  copyInput.value = 'Direct hero art from data bindings'
  taglineInput.value = 'Swap imagery and typography with reactive Fabric components.'
  uppercaseHeadline.value = false
  headlineSize.value = 66
  charSpacing.value = 0
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-[28px] border border-panel bg-panel p-3 sm:p-4">
      <div class="canvas-shell aspect-[16/9] overflow-hidden rounded-[24px] border border-panel-soft bg-overlay-strong shadow-[0_40px_90px_-45px_rgba(15,23,42,0.9)]">
        <FabricCanvas :canvas-options="{ width: 960, height: 540, preserveObjectStacking: true }">
          <RenderGroup :priority="1">
            <FabricImage v-model="heroImage" preset="background" />
          </RenderGroup>
          <RenderGroup :priority="2">
            <FabricText v-model="headline" />
            <FabricText v-model="tagline" />
          </RenderGroup>
          <RenderGroup :priority="3">
            <FabricText v-model="accentLabel" />
          </RenderGroup>
        </FabricCanvas>
      </div>
    </div>

    <section class="grid gap-4 rounded-[24px] border border-panel bg-panel-soft p-4 text-[13px] text-primary md:grid-cols-2">
      <div class="space-y-4">
        <div class="space-y-2">
          <span class="eyebrow">Scene variants</span>
          <p class="text-sm text-muted">
            Switch hero photography to see how FabricImage presets rehydrate with different palettes.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="variant in HERO_VARIANTS"
            :key="variant.id"
            class="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] transition"
            :class="variant.id === selectedVariantId ? 'border-cyan-400/70 bg-cyan-400/10 text-primary' : 'border-panel-soft text-muted hover:border-panel'"
            @click="selectedVariantId = variant.id"
          >
            {{ variant.label }}
          </button>
        </div>
      </div>
      <div class="space-y-4">
        <div class="space-y-2">
          <span class="eyebrow">Typography</span>
          <p class="text-sm text-muted">
            Bind form inputs to FabricText props. Every change diffs into the canvas immediately.
          </p>
        </div>
        <form class="grid gap-3">
          <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
            Headline
            <input v-model="copyInput" class="rounded-2xl border border-panel bg-panel px-3 py-2 text-sm text-primary" type="text">
          </label>
          <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
            Tagline
            <textarea v-model="taglineInput" rows="2" class="rounded-2xl border border-panel bg-panel px-3 py-2 text-sm text-primary" />
          </label>
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
              Size
              <input v-model.number="headlineSize" min="44" max="92" type="range">
            </label>
            <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
              Tracking
              <input v-model.number="charSpacing" min="0" max="400" step="10" type="range">
            </label>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em]">
            <label class="inline-flex items-center gap-2">
              <input v-model="uppercaseHeadline" type="checkbox">
              Uppercase headline
            </label>
            <label class="inline-flex items-center gap-2">
              <input v-model="showSelection" type="checkbox">
              Enable selection
            </label>
          </div>
          <button type="button" class="inline-flex w-fit items-center rounded-full border border-panel px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-muted transition hover:text-primary" @click="resetCopy">
            Reset values
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
