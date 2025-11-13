<script setup lang="ts">
import type {
  FabricImageModelValue,
  FabricRectModelValue,
  FabricTextModelValue,
} from 'vue-fabric-fiber'
import { ref, watchEffect } from 'vue'
import { FabricCanvas, FabricImage, FabricRect, FabricText, RenderGroup } from 'vue-fabric-fiber'

const baseImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
  width: '100%',
  height: '100%',
  selectable: false,
  hasControls: false,
})

const gradientOverlay = ref<FabricRectModelValue>({
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  fill: 'rgba(2,6,23,0.92)',
  selectable: false,
  hasControls: false,
})

const portrait = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  width: 380,
  height: 460,
  left: 610,
  top: 110,
  angle: -8,
  shadow: 'rgba(2,6,23,0.45) 0px 25px 60px',
  selectable: true,
  hasControls: true,
})

const headline = ref<FabricTextModelValue>({
  text: 'Layered composition',
  left: 120,
  top: 140,
  width: 420,
  fontSize: 60,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#f8fafc',
  lineHeight: 1.2,
  selectable: false,
  hasControls: false,
})

const blurb = ref<FabricTextModelValue>({
  text: 'Each RenderGroup queues its children so async loads stay ordered.',
  left: 120,
  top: 240,
  width: 420,
  fontSize: 28,
  fontFamily: 'Inter',
  fontWeight: '500',
  fill: '#cbd5f5',
  lineHeight: 1.5,
  selectable: false,
  hasControls: false,
})

const overlayOpacity = ref(0.65)
const backgroundPriority = ref(0)
const overlayPriority = ref(1)
const textPriority = ref(2)
const portraitPriority = ref(3)
const disablePortraitQueue = ref(false)

watchEffect(() => {
  gradientOverlay.value.opacity = overlayOpacity.value
})
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-[28px] border border-panel bg-panel p-3 sm:p-4">
      <div class="canvas-shell aspect-[16/9] overflow-hidden rounded-[24px] border border-panel-soft bg-overlay-strong">
        <FabricCanvas :canvas-options="{ width: 980, height: 560, preserveObjectStacking: true }">
          <RenderGroup :priority="backgroundPriority">
            <FabricImage v-model="baseImage" preset="background" />
          </RenderGroup>
          <RenderGroup :priority="overlayPriority">
            <FabricRect v-model="gradientOverlay" />
          </RenderGroup>
          <RenderGroup :priority="textPriority">
            <FabricText v-model="headline" />
            <FabricText v-model="blurb" />
          </RenderGroup>
          <RenderGroup :priority="portraitPriority" :disable-queue="disablePortraitQueue">
            <FabricImage v-model="portrait" preset="overlay" />
          </RenderGroup>
        </FabricCanvas>
      </div>
    </div>

    <section class="rounded-[24px] border border-panel bg-panel-soft p-4 text-[13px] text-primary">
      <div class="space-y-2">
        <span class="eyebrow">RenderGroup orchestration</span>
        <p class="text-sm text-muted">
          Adjust queue priorities and bypass flags to study how layered scenes stay synchronized.
        </p>
      </div>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Overlay opacity
          <input v-model.number="overlayOpacity" type="range" min="0" max="1" step="0.05">
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Portrait priority
          <input v-model.number="portraitPriority" type="number" class="rounded-2xl border border-panel bg-panel px-3 py-1.5 text-sm text-primary">
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Background priority
          <input v-model.number="backgroundPriority" type="number" class="rounded-2xl border border-panel bg-panel px-3 py-1.5 text-sm text-primary">
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Copy priority
          <input v-model.number="textPriority" type="number" class="rounded-2xl border border-panel bg-panel px-3 py-1.5 text-sm text-primary">
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Overlay priority
          <input v-model.number="overlayPriority" type="number" class="rounded-2xl border border-panel bg-panel px-3 py-1.5 text-sm text-primary">
        </label>
        <div class="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted">
          <input id="bypass" v-model="disablePortraitQueue" type="checkbox">
          <label for="bypass">Bypass portrait queue</label>
        </div>
      </div>
    </section>
  </div>
</template>
