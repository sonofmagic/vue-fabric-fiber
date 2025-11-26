<script setup lang="ts">
import type { Canvas } from 'fabric'
import type {
  FabricImageModelValue,
  FabricRectModelValue,
  FabricTextModelValue,
} from 'vue-fabric-fiber'
import {
  FabricCanvas,
  FabricImage,
  FabricRect,
  FabricText,
  RenderGroup,
} from 'vue-fabric-fiber'

const props = defineProps<{
  canvasOptions: Record<string, unknown>
  onCanvasReady: (canvas: Canvas) => void
}>()

const pageMatte = defineModel<FabricRectModelValue>('pageMatte', { required: true })
const pageOutline = defineModel<FabricRectModelValue>('pageOutline', { required: true })
const pdfLayer = defineModel<FabricImageModelValue | null>('pdfLayer', { required: true })
const placeholderLabel = defineModel<FabricTextModelValue>('placeholderLabel', { required: true })
const watermarkSkuText = defineModel<FabricTextModelValue>('watermarkSkuText', { required: true })
const watermarkOrderText = defineModel<FabricTextModelValue>('watermarkOrderText', { required: true })
</script>

<template>
  <section class="rounded-[28px] border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] p-4 sm:p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-semibold text-[var(--fp-text-primary)]">
          裁剪预览
        </p>
        <p class="text-xs text-[var(--fp-text-muted)]">
          未上传时显示占位状态，导入后可直接拖拽 PDF。
        </p>
      </div>
      <span class="rounded-full border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg-soft)] px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[var(--fp-text-muted)]">
        FabricCanvas
      </span>
    </div>

    <div class="mt-4 rounded-[24px] border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg-soft)] p-3 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.9)]">
      <div
        class="overflow-hidden rounded-[20px] border border-[var(--fp-border-color)] bg-[var(--fp-panel-bg)] bg-[linear-gradient(45deg,rgba(148,163,184,0.08)_25%,transparent_25%),linear-gradient(-45deg,rgba(148,163,184,0.08)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(148,163,184,0.08)_75%),linear-gradient(-45deg,transparent_75%,rgba(148,163,184,0.08)_75%)] bg-[length:48px_48px] bg-[position:0_0,0_24px,24px_-24px,-24px_0]"
      >
        <FabricCanvas class="fp-pdf-canvas" :canvas-options="props.canvasOptions" @ready="props.onCanvasReady">
          <RenderGroup :priority="0">
            <FabricRect v-model="pageMatte" />
          </RenderGroup>
          <RenderGroup :priority="1">
            <FabricImage
              v-if="pdfLayer"
              v-model="pdfLayer"
              preset="overlay"
            />
            <FabricText
              v-else
              v-model="placeholderLabel"
            />
          </RenderGroup>
          <RenderGroup :priority="2">
            <FabricRect v-model="pageOutline" />
          </RenderGroup>
          <RenderGroup :priority="3">
            <FabricText v-model="watermarkSkuText" />
            <FabricText v-model="watermarkOrderText" />
          </RenderGroup>
        </FabricCanvas>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fp-pdf-canvas :deep(canvas) {
  display: block;
  width: 100%;
  max-width: 440px;
  height: auto;
}
</style>
