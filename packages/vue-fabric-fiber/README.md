# vue-fabric-fiber

Composable Vue wrappers around Fabric.js primitives. Each component manages its own Fabric object lifecycle and keeps props in sync with the underlying canvas instance.

## Installation

```bash
pnpm add vue-fabric-fiber fabric
```

## Quick Start

```vue
<script setup lang="ts">
import type { FabricRectModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { ref } from 'vue'
import {
  FabricCanvas,
  FabricCircle,
  FabricImage,
  FabricRect,

  FabricText

} from 'vue-fabric-fiber'

const rect = ref<FabricRectModelValue>({
  left: 120,
  top: 140,
  width: 220,
  height: 140,
  fill: '#38bdf8',
})

const label = ref<FabricTextModelValue>({
  text: 'Hello Fabric',
  left: 160,
  top: 180,
  fontSize: 42,
  fill: '#fef3c7',
})
</script>

<template>
  <FabricCanvas :canvas-options="{ width: 640, height: 400, selection: true }">
    <FabricImage
      src="https://picsum.photos/640/400"
      width="640"
      height="400"
      :selectable="false"
      :has-controls="false"
    />
    <FabricRect v-model="rect" />
    <FabricCircle :model-value="{ left: 420, top: 180, radius: 60, fill: '#f472b6' }" />
    <FabricText v-model="label" />
  </FabricCanvas>
</template>
```

## Components

| Component       | Description                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FabricCanvas`  | Root context provider. Creates the `fabric.Canvas` instance and injects control helpers for child objects.                                                                                                  |
| `RenderGroup`   | Nested task queue/scoping. Useful for grouping async loads or delaying render until the canvas is ready.                                                                                                    |
| Object wrappers | `FabricImage`, `FabricText`, `FabricRect`, `FabricCircle`, `FabricEllipse`, `FabricTriangle`, `FabricLine`, `FabricPath`, `FabricPolyline`, `FabricPolygon`. Each offers two-way binding through `v-model`. |

### Object Props

All shape components accept the typed subset of their Fabric counterparts. For example `FabricRect` works with `FabricRectModelValue`, mirroring `fabric.Rect` options minus canvas-only fields such as `clipPath`. When **model binding** is not required, you may pass `:model-value="{ ... }"` as a one-way prop.

### Sequential Mutations

Complex additions or async loads should wrap content in `RenderGroup` so the task queue respects insertion order:

```vue
<FabricCanvas>
  <RenderGroup>
    <FabricImage src="/map.png" width="1024" :selectable="false" />
    <FabricText :model-value="{ text: 'Overlay', left: 400, top: 240 }" />
  </RenderGroup>
</FabricCanvas>
```

## Type Exports

All `ModelValue` helper types are available from the package root. Import them to author type-safe refs:

```ts
import type { FabricPathModelValue } from 'vue-fabric-fiber'
```

## Demos

Run the playground to view interactive recipes:

```bash
pnpm --filter vue-fabric-fiber dev -- --open
```

Routes:

- `/` — Overview + JSON inspector
- `/demos/basic` — hero banner composition
- `/demos/text-playground` — text props playground
- `/demos/composite` — layered scenes with `RenderGroup`
- `/demos/shapes` — shape toolkit covering all primitives

## Build targets

- `pnpm build` — type-checks via `vue-tsc -b` and bundles the component library in `dist/`.
- `pnpm build:site` — runs the Vite app build (output lives in `dist-site/`) so you can deploy the marketing/demo website separately from the library artifacts.

## SEO configuration

- Set `VITE_SITE_URL` in your `.env` (for example `https://fabric-ports.netlify.app`) so canonical links, JSON-LD, and social cards point to the correct domain.
- Update `public/sitemap.xml` whenever you add or rename demo routes.
- Robots and favicons live in `public/robots.txt` and `public/favicon.svg`; tweak them to match your deployment before shipping.
