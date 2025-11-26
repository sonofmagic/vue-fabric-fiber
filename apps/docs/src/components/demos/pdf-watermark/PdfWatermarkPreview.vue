<script setup lang="ts">
import type { Canvas } from 'fabric'
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import {
  FabricCanvas,
  FabricImage,
  FabricText,
  RenderGroup,
} from 'vue-fabric-fiber'

const props = defineProps<{
  canvasOptions: Record<string, unknown>
  onCanvasReady: (canvas: Canvas) => void
}>()

const pdfLayer = defineModel<FabricImageModelValue | null>('pdfLayer', { required: true })
const placeholderLabel = defineModel<FabricTextModelValue>('placeholderLabel', { required: true })
const watermarkSkuText = defineModel<FabricTextModelValue>('watermarkSkuText', { required: true })
const watermarkOrderText = defineModel<FabricTextModelValue>('watermarkOrderText', { required: true })
</script>

<template>
  <section class="rounded-[28px] border border-(--fp-border-color) bg-(--fp-panel-bg) p-4 sm:p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-semibold text-(--fp-text-primary)">
          裁剪预览
        </p>
        <p class="text-xs text-(--fp-text-muted)">
          未上传时显示占位状态，导入后可直接拖拽 PDF。
        </p>
      </div>
      <span class="rounded-full border border-(--fp-border-color) bg-(--fp-panel-bg-soft) px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-(--fp-text-muted)">
        FabricCanvas
      </span>
    </div>

    <div class="mt-5 flex flex-col gap-4">
      <article class="flex flex-col gap-3 rounded-3xl border border-(--fp-border-color) bg-(--fp-panel-bg-soft) p-4 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.9)] sm:p-5">
        <header class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-(--fp-text-primary)">
              stack-order
            </p>
            <p class="text-xs text-(--fp-text-muted)">
              模板顺序 + stack-order，避免额外分组。
            </p>
          </div>
          <span class="rounded-full border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-(--fp-text-muted)">
            方案 A
          </span>
        </header>
        <div class="overflow-hidden rounded-[20px] border border-(--fp-border-color) bg-(--fp-panel-bg) bg-[linear-gradient(45deg,rgba(148,163,184,0.08)_25%,transparent_25%),linear-gradient(-45deg,rgba(148,163,184,0.08)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(148,163,184,0.08)_75%),linear-gradient(-45deg,transparent_75%,rgba(148,163,184,0.08)_75%)] bg-size-[48px_48px] bg-position-[0_0,0_24px,24px_-24px,-24px_0]">
          <FabricCanvas class="fp-pdf-canvas" :canvas-options="props.canvasOptions" @ready="props.onCanvasReady">
            <FabricImage
              v-if="pdfLayer"
              v-model="pdfLayer"
              preset="overlay"
              :stack-order="0"
            />
            <FabricText
              v-else
              v-model="placeholderLabel"
              :stack-order="0"
            />
            <FabricText v-model="watermarkSkuText" :stack-order="1" />
            <FabricText v-model="watermarkOrderText" :stack-order="2" />
          </FabricCanvas>
        </div>
      </article>

      <article class="flex flex-col gap-3 rounded-3xl border border-(--fp-border-color) bg-(--fp-panel-bg-soft) p-4 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.9)] sm:p-5">
        <header class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-(--fp-text-primary)">
              RenderGroup
            </p>
            <p class="text-xs text-(--fp-text-muted)">
              优先级分层，适合复杂异步队列。
            </p>
          </div>
          <span class="rounded-full border border-(--fp-border-color) bg-(--fp-panel-bg) px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-(--fp-text-muted)">
            方案 B
          </span>
        </header>
        <div class="overflow-hidden rounded-[20px] border border-(--fp-border-color) bg-(--fp-panel-bg) bg-[linear-gradient(45deg,rgba(148,163,184,0.08)_25%,transparent_25%),linear-gradient(-45deg,rgba(148,163,184,0.08)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(148,163,184,0.08)_75%),linear-gradient(-45deg,transparent_75%,rgba(148,163,184,0.08)_75%)] bg-size-[48px_48px] bg-position-[0_0,0_24px,24px_-24px,-24px_0]">
          <FabricCanvas class="fp-pdf-canvas" :canvas-options="props.canvasOptions" @ready="props.onCanvasReady">
            <RenderGroup :priority="0">
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
            <RenderGroup :priority="1">
              <FabricText v-model="watermarkSkuText" />
              <FabricText v-model="watermarkOrderText" />
            </RenderGroup>
          </FabricCanvas>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.fp-pdf-canvas :deep(canvas) {
  display: block;
  width: min(100%, 500px);
  height: auto;
  margin-inline: auto;
}
</style>
