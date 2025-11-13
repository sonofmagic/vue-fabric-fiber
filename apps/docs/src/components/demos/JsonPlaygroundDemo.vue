<script setup lang="ts">
import type { Component } from 'vue'
import { computed, ref, watch } from 'vue'
import { FabricCanvas, FabricImage, FabricRect, FabricText } from 'vue-fabric-fiber'

type SceneNodeType = 'image' | 'text' | 'rect'

interface SceneNode {
  id: string
  type: SceneNodeType
  preset?: string
  model: Record<string, unknown>
}

interface ScenePreset {
  id: string
  label: string
  nodes: SceneNode[]
}

const SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'hero',
    label: 'Hero banner',
    nodes: [
      {
        id: 'background',
        type: 'image',
        preset: 'background',
        model: {
          src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
          width: '100%',
          height: '100%',
        },
      },
      {
        id: 'headline',
        type: 'text',
        model: {
          text: 'JSON-driven composition',
          left: 120,
          top: 140,
          fontSize: 56,
          fontFamily: 'Inter',
          fontWeight: '700',
          fill: '#f8fafc',
          shadow: 'rgba(2,6,23,0.35) 0px 18px 60px',
        },
      },
      {
        id: 'subtitle',
        type: 'text',
        model: {
          text: 'Update this array and the canvas refreshes automatically.',
          left: 120,
          top: 220,
          width: 520,
          fontSize: 26,
          fontFamily: 'Inter',
          fontWeight: '500',
          fill: '#cbd5f5',
          lineHeight: 1.4,
        },
      },
      {
        id: 'chip',
        type: 'rect',
        model: {
          left: 120,
          top: 300,
          width: 280,
          height: 56,
          rx: 28,
          ry: 28,
          fill: 'rgba(15,23,42,0.75)',
          stroke: '#38bdf8',
          strokeWidth: 2,
        },
      },
      {
        id: 'chipLabel',
        type: 'text',
        model: {
          text: 'FabricCanvas + RenderGroup',
          left: 140,
          top: 317,
          fontSize: 18,
          fontFamily: 'DM Sans',
          fontWeight: '600',
          fill: '#f8fafc',
        },
      },
    ],
  },
  {
    id: 'grid',
    label: 'Poster grid',
    nodes: [
      {
        id: 'bg',
        type: 'rect',
        model: {
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          fill: '#020617',
        },
      },
      ...Array.from({ length: 4 }, (_, idx) => ({
        id: `poster-${idx}`,
        type: 'image',
        model: {
          src: `https://images.unsplash.com/photo-1520${80 + idx}7162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80`,
          width: 260,
          height: 360,
          left: 80 + (idx % 2) * 280,
          top: 80 + Math.floor(idx / 2) * 220,
          angle: idx % 2 === 0 ? -6 : 8,
          shadow: 'rgba(2,6,23,0.55) 0px 20px 60px',
        },
      })),
      {
        id: 'gridTitle',
        type: 'text',
        model: {
          text: 'Poster wall',
          left: 660,
          top: 120,
          fontSize: 58,
          fontFamily: 'Inter',
          fontWeight: '700',
          fill: '#f8fafc',
        },
      },
      {
        id: 'gridCopy',
        type: 'text',
        model: {
          text: 'JSON nodes hydrate Fabric components inside Vue.',
          left: 660,
          top: 200,
          width: 260,
          fontSize: 24,
          fontFamily: 'Inter',
          lineHeight: 1.4,
          fill: '#94a3b8',
        },
      },
    ],
  },
]

const fallbackScene = SCENE_PRESETS[0].nodes
const selectedPresetId = ref(SCENE_PRESETS[0].id)
const sceneSource = ref(JSON.stringify(SCENE_PRESETS[0].nodes, null, 2))

watch(selectedPresetId, (id) => {
  const preset = SCENE_PRESETS.find(entry => entry.id === id)
  if (preset) {
    sceneSource.value = JSON.stringify(preset.nodes, null, 2)
  }
})

const parsedScene = computed(() => {
  try {
    const parsed = JSON.parse(sceneSource.value)
    if (!Array.isArray(parsed)) {
      throw new TypeError('Scene must be an array of nodes')
    }
    return { nodes: parsed as SceneNode[], error: null }
  }
  catch (error) {
    return {
      nodes: fallbackScene,
      error: error instanceof Error ? error.message : String(error),
    }
  }
})

function resolveComponent(type: SceneNodeType): Component {
  switch (type) {
    case 'image':
      return FabricImage
    case 'rect':
      return FabricRect
    case 'text':
    default:
      return FabricText
  }
}

function buildBindings(node: SceneNode) {
  const bindings: Record<string, unknown> = {
    modelValue: node.model,
  }
  if (node.preset) {
    bindings.preset = node.preset
  }
  return bindings
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
    <div class="rounded-[28px] border border-panel bg-panel p-3 sm:p-4">
      <div class="canvas-shell aspect-[16/9] overflow-hidden rounded-[24px] border border-panel-soft bg-overlay-strong">
        <FabricCanvas :canvas-options="{ width: 980, height: 540, preserveObjectStacking: true, backgroundColor: '#020617' }">
          <component
            :is="resolveComponent(node.type)"
            v-for="node in parsedScene.nodes"
            :key="node.id"
            v-bind="buildBindings(node)"
          />
        </FabricCanvas>
      </div>
    </div>

    <section class="space-y-4 rounded-[24px] border border-panel bg-panel-soft p-4 text-[13px] text-primary">
      <div class="space-y-1">
        <span class="eyebrow">Scene blueprint</span>
        <p class="text-sm text-muted">
          Paste JSON describing Fabric nodes—each entry resolves to a Vue component.
        </p>
      </div>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
        Preset
        <select v-model="selectedPresetId" class="rounded-2xl border border-panel bg-panel px-3 py-2 text-sm text-primary">
          <option v-for="preset in SCENE_PRESETS" :key="preset.id" :value="preset.id">
            {{ preset.label }}
          </option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-[11px] uppercase tracking-[0.26em] text-dim">
        JSON
        <textarea v-model="sceneSource" rows="14" class="rounded-2xl border border-panel bg-panel px-3 py-2 font-mono text-[12px] leading-relaxed text-primary" />
      </label>
      <p v-if="parsedScene.error" class="rounded-2xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
        {{ parsedScene.error }}
      </p>
      <p v-else class="text-xs text-muted">
        {{ parsedScene.nodes.length }} nodes detected.
      </p>
    </section>
  </div>
</template>
