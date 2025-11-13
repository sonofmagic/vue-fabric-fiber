<script setup lang="ts">
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { ref, watchEffect } from 'vue'
import { FabricCanvas, FabricImage, FabricText } from 'vue-fabric-fiber'

const background = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
  width: '100%',
  height: '100%',
  selectable: false,
  hasControls: false,
})

const headline = ref<FabricTextModelValue>({
  text: 'Interactive typography lab',
  left: 120,
  top: 120,
  width: 640,
  fontSize: 68,
  fontFamily: 'Inter',
  fontWeight: '700',
  fill: '#f8fafc',
  lineHeight: 1.1,
  selectable: false,
  hasControls: false,
})

const bodyCopy = ref<FabricTextModelValue>({
  text: 'Bind FabricText props to any Vue input and watch the canvas respond instantly.',
  left: 120,
  top: 250,
  width: 520,
  fontSize: 28,
  fontFamily: 'Inter',
  fontWeight: '500',
  fill: '#cbd5f5',
  lineHeight: 1.45,
  selectable: false,
  hasControls: false,
})

const headlineInput = ref(headline.value.text)
const bodyInput = ref(bodyCopy.value.text)
const fontSize = ref(68)
const charSpacing = ref(0)
const lineHeight = ref(1.1)
const textAlign = ref<'left' | 'center' | 'right'>('left')
const fill = ref('#f8fafc')
const strokeWidth = ref(0)
const uppercase = ref(false)
const italic = ref(false)
const addShadow = ref(true)

watchEffect(() => {
  headline.value.text = uppercase.value ? headlineInput.value.toUpperCase() : headlineInput.value
})

watchEffect(() => {
  bodyCopy.value.text = bodyInput.value
})

watchEffect(() => {
  headline.value.fontSize = fontSize.value
})

watchEffect(() => {
  headline.value.charSpacing = charSpacing.value
})

watchEffect(() => {
  headline.value.lineHeight = lineHeight.value
})

watchEffect(() => {
  headline.value.textAlign = textAlign.value
  bodyCopy.value.textAlign = textAlign.value
})

watchEffect(() => {
  headline.value.fill = fill.value
})

watchEffect(() => {
  const stroke = strokeWidth.value > 0 ? '#020617' : undefined
  headline.value.stroke = stroke
  headline.value.strokeWidth = strokeWidth.value
})

watchEffect(() => {
  headline.value.fontStyle = italic.value ? 'italic' : 'normal'
})

watchEffect(() => {
  headline.value.shadow = addShadow.value ? 'rgba(2,6,23,0.48) 0px 28px 80px' : undefined
})
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-[28px] border border-panel bg-panel p-3 sm:p-4">
      <div class="canvas-shell aspect-[16/9] overflow-hidden rounded-[24px] border border-panel-soft bg-overlay-strong">
        <FabricCanvas :canvas-options="{ width: 960, height: 540, preserveObjectStacking: true }">
          <FabricImage v-model="background" preset="background" />
          <FabricText v-model="headline" />
          <FabricText v-model="bodyCopy" />
        </FabricCanvas>
      </div>
    </div>

    <section class="grid gap-4 rounded-[24px] border border-panel bg-panel-soft p-4 text-[13px] text-primary lg:grid-cols-2">
      <div class="space-y-3">
        <span class="eyebrow">Copy</span>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Headline
          <input v-model="headlineInput" type="text" class="rounded-2xl border border-panel bg-panel px-3 py-2 text-sm text-primary">
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Body
          <textarea v-model="bodyInput" rows="3" class="rounded-2xl border border-panel bg-panel px-3 py-2 text-sm text-primary" />
        </label>
        <div class="flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-muted">
          <label class="inline-flex items-center gap-2">
            <input v-model="uppercase" type="checkbox">
            Uppercase
          </label>
          <label class="inline-flex items-center gap-2">
            <input v-model="italic" type="checkbox">
            Italic
          </label>
          <label class="inline-flex items-center gap-2">
            <input v-model="addShadow" type="checkbox">
            Shadow
          </label>
        </div>
      </div>
      <div class="space-y-3">
        <span class="eyebrow">Styles</span>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Size
          <input v-model.number="fontSize" min="36" max="100" type="range">
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Tracking
          <input v-model.number="charSpacing" min="0" max="400" step="10" type="range">
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Line height
          <input v-model.number="lineHeight" min="1" max="1.8" step="0.05" type="range">
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Text align
          <select v-model="textAlign" class="rounded-2xl border border-panel bg-panel px-3 py-2 text-sm text-primary">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Fill
          <input v-model="fill" type="color" class="h-10 rounded-2xl border border-panel bg-panel px-2">
        </label>
        <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
          Stroke width
          <input v-model.number="strokeWidth" min="0" max="6" step="1" type="range">
        </label>
      </div>
    </section>
  </div>
</template>
