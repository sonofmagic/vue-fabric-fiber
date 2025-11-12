import { code, plainRichText, richText, text } from '../richText'

const en = {
  locale: {
    label: 'Language',
    options: {
      en: 'English',
      zh: '中文',
    },
  },
  app: {
    brand: {
      tagline: 'Demo Studio',
    },
    nav: {
      overview: 'Overview',
      docs: 'Docs',
      demos: 'Demos',
      github: 'GitHub',
      toggle: 'Toggle navigation',
    },
    footer: {
      builtWith: 'Built with Fabric.js bindings for Vue.',
      copyright: '© {year} Fabric Ports',
    },
    actions: {
      close: 'Close',
      viewDemo: 'View demo',
      viewAllDemos: 'View all demos',
      exploreHeroBuilder: 'Explore hero builder',
      typographyCanvas: 'Typography canvas',
      enterInteractive: 'Enter interactive mode',
      exitInteractive: 'Exit interactive mode',
      lightMode: 'Switch to light mode',
      darkMode: 'Switch to dark mode',
      lightModeShort: 'Light',
      darkModeShort: 'Dark',
    },
  },
  components: {
    demoRepl: {
      errorTitle: 'Failed to load playground:',
      loading: 'Preparing interactive playground…',
    },
  },
  home: {
    meta: {
      title: 'Overview',
      description:
        'Compose Fabric.js canvases with Vue-first ergonomics, typed bindings, and live JSON editors powered by Fabric Ports.',
      keywords: ['fabric.js', 'vue 3', 'canvas bindings', 'rendergroup', 'json editor', 'design tooling'],
    },
    hero: {
      eyebrow: 'Vue + Fabric.js',
      title: 'Design layered Fabric canvases with live data contracts',
      description:
        'Balance aesthetics and instrumentation in one Vue file. The hero scene below mixes background imagery, gradient tiles, badges, and RenderGroup queues—all editable through a synced JSON inspector.',
      highlightsTitle: 'Why Fabric Ports',
      highlights: [
        {
          title: 'Scene graphs stay visual',
          description:
            'Blend imagery, gradients, and primitives in a single template. Every Fabric object is declared in Vue, so the scene graph reads like a component tree.',
        },
        {
          title: 'Inspector mirrors every tweak',
          description:
            'Drag targets on the canvas and watch the JSON inspector update. Modify the payload directly to drive precise coordinates or sizing.',
        },
        {
          title: 'Render order stays deterministic',
          description:
            'RenderGroup queues serialize async loads and layered imagery so hero scenes never flash or reorder when assets resolve.',
        },
      ],
      stats: [
        { label: 'Nodes', value: '12 interactive objects' },
        { label: 'Latency', value: '< 16ms updates' },
        { label: 'Presets', value: '5 canvas recipes' },
      ],
      layerTypes: {
        image: 'Image',
        text: 'Text',
        rect: 'Rect',
        circle: 'Circle',
      },
      layerLabels: {
        heroImage: 'Hero image',
        accentPortrait: 'Accent portrait',
        renderGroupTitle: 'RenderGroup title',
        renderGroupGreeting: 'RenderGroup greeting',
        glowTile: 'Glow tile {index}',
        copyLayer: 'Copy layer {index}',
        halo: 'Pulse halo',
      },
      layerSummaries: {
        heroFallback: 'Unsplash source',
        accentFallback: 'Overlay source',
        glowTile: '{width}×{height}px @ ({left}, {top})',
        halo: 'Radius {radius}px',
      },
      canvasCopy: {
        headline: [
          'Fabric Ports Studio',
          'Declarative canvas operating system',
          'Live bindings · Scene graph · Render queues',
        ],
        queueTitle: 'Render queue pinned',
        queueStatus: '● Syncing layers',
      },
      interactive: {
        eyebrow: 'Hero playground',
        title: 'Live canvas composer',
        description:
          'Experiment with the hero scene without leaving the browser. Toggle interactive mode to split the view and keep both canvas and controls in a single frame.',
        toggle: {
          enter: 'Enter interactive mode',
          exit: 'Exit interactive mode',
        },
        closeLabel: 'Close',
        panel: {
          title: 'Canvas inspector',
          description:
            'Adjust imagery, queue copy, and layered text. Inputs map directly to Fabric refs, so every tweak updates the hero in real time.',
        },
        portrait: {
          title: 'Portrait overlay',
          type: 'Image',
          fields: {
            left: 'Left (px)',
            top: 'Top (px)',
            width: 'Width (px)',
            angle: 'Angle (°)',
          },
        },
        headline: {
          title: 'Headline layers',
          type: 'Text',
          fields: {
            selectLabel: 'Layer',
            copy: 'Copy',
            fontSize: 'Font size',
            color: 'Color',
            left: 'Left (px)',
            top: 'Top (px)',
          },
          empty: 'Add a headline layer to start editing copy.',
        },
        halo: {
          title: 'Halo & queue copy',
          type: 'Mixed',
          fields: {
            queueTitle: 'Queue title',
            titleColor: 'Title color',
            queueStatus: 'Queue status',
            statusColor: 'Status color',
          },
        },
      },
      featured: {
        eyebrow: 'Explore',
        title: 'Demo gallery',
        description:
          'Dive into specialised canvases to test typography bindings, layer async assets, or compose geometric primitives. Each demo mirrors production-grade configurations.',
      },
    },
  },
  demos: {
    meta: {
      keywords: ['fabric.js demos', 'vue canvas examples', 'rendergroup gallery'],
    },
    hero: {
      eyebrow: 'Demo gallery',
      title: 'Explore vue-fabric-fiber canvases',
      description:
        'Browse curated Fabric.js examples rebuilt with Vue bindings. Each page highlights a specific integration pattern—custom objects, layered scenes, typography bindings, and more.',
    },
    tags: {
      text: 'Text',
      image: 'Image',
      reactive: 'Reactive',
      animation: 'Animation',
      customObject: 'Custom Object',
      json: 'JSON',
      dynamicScenes: 'Dynamic Scenes',
      typography: 'Typography',
      bindings: 'Bindings',
      renderGroup: 'RenderGroup',
      layers: 'Layers',
      shapes: 'Shapes',
      primitives: 'Primitives',
    },
    cards: {
      basic: {
        title: 'Basic Hero Banner',
        description: 'Layer text on top of asynchronous imagery and tweak layout controls in real time.',
        tags: ['text', 'image', 'reactive'],
      },
      animatingCrosses: {
        title: 'Animating Crosses',
        description: 'Recreate Fabric’s classic cross animation with component-driven objects and palette controls.',
        tags: ['animation', 'customObject'],
      },
      playground: {
        title: 'Code Playground',
        description: 'Edit scene blueprints and instantly render Fabric components from JSON-driven instructions.',
        tags: ['json', 'dynamicScenes'],
      },
      textPlayground: {
        title: 'Interactive Typography',
        description: 'Directly bind fabric text props to form inputs and keep canvas edits in sync.',
        tags: ['typography', 'bindings'],
      },
      composite: {
        title: 'Layered Composition',
        description: 'Combine RenderGroup queues to orchestrate complex scenes with toggled layers.',
        tags: ['renderGroup', 'layers'],
      },
      shapes: {
        title: 'Shape Toolkit',
        description: 'Rectangles, polylines, paths, and more using the Fabric shape components.',
        tags: ['shapes', 'primitives'],
      },
    },
    detail: {
      common: {
        eyebrow: 'Live playground',
      },
      helpers: {
        basic: 'Swap hero art, typography, and selection props in the editor while the Fabric canvas stays reactive.',
        animatingCrosses:
          'This port recreates Fabric’s classic animation with custom objects, palette controls, and canvas level watchers.',
        playground:
          'Paste JSON scene descriptions, switch presets, and watch Fabric render instructions derived from the data layer.',
        textPlayground:
          'Bind range sliders, inputs, and toggles straight into FabricText props and see edits reflected on every keystroke.',
        composite:
          'RenderGroup queues, async imagery, and toggled layers stay in sync so you can study how the bindings orchestrate complex scenes.',
        shapes:
          'Every primitive—from rectangles and polygons to custom paths—runs through the same Fabric bindings so you can remix them safely.',
      },
      notes: {
        basic: {
          intro: 'Code lives in ',
          outro:
            '. Edit it inside the embedded @vue/repl to inspect both source and canvas output simultaneously.',
        },
        animatingCrosses: {
          intro: 'The REPL loads ',
          outro:
            ' so you can explore the animated Fabric object implementation without leaving the page.',
        },
        playground: {
          intro: 'The editor loads ',
          outro: ' so you can iterate on the scene blueprint that powers the controls.',
        },
        textPlayground: {
          intro: 'Use ',
          outro:
            ' inside the REPL to tweak copy, gradients, and input bindings side by side with the rendered canvas.',
        },
        composite: {
          intro: 'Edit ',
          outro:
            ' directly in the embedded editor to understand how each RenderGroup slot feeds the Fabric canvas.',
        },
        shapes: {
          intro: 'Explore ',
          outro: ' to see how each primitive maps to the Fabric.js API within @vue/repl.',
        },
      },
    },
  },
  docs: {
    meta: {
      title: 'Docs',
      description: 'Usage documentation for vue-fabric-fiber components and Fabric.js bindings.',
      keywords: ['vue-fabric-fiber docs', 'FabricCanvas props', 'RenderGroup queue', 'FabricImage bindings'],
    },
    hero: {
      eyebrow: 'Usage docs',
      title: 'vue-fabric-fiber component reference',
      description:
        'Understand how FabricCanvas, FabricImage, FabricText, RenderGroup, and geometry helpers behave so you can compose canvases with confidence.',
      quickLinksLabel: 'Sections',
    },
    sections: [
      {
        id: 'getting-started',
        title: 'Getting started',
        description: plainRichText(
          'Install the bindings, create reactive model values, and drop Fabric components into any Vue tree—everything is written as standard SFCs.',
        ),
        points: [
          richText(
            text('Install with '),
            code('pnpm add vue-fabric-fiber'),
            text(' and import only the components you render; each export is tree-shakable.'),
          ),
          richText(
            text('Scene state lives in refs typed like '),
            code('FabricImageModelValue'),
            text(' or '),
            code('FabricTextModelValue'),
            text(', so you can hydrate from JSON or persist canvases anywhere.'),
          ),
          plainRichText('Standard Vue inputs, sliders, and watchers update those refs; the binding layer diffs props and syncs Fabric objects for you.'),
        ],
        apiList: ['FabricCanvas', 'FabricImage', 'FabricText'],
        codeTitle: 'Minimal canvas',
        codeLang: 'vue',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { FabricCanvas, FabricImage, FabricText } from 'vue-fabric-fiber'

const heroImage = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  width: '100%',
  height: '100%',
  selectable: false,
  hasControls: false,
})

const heroTitle = ref<FabricTextModelValue>({
  text: 'Fabric Ports',
  left: 120,
  top: 160,
  fontSize: 72,
  fontWeight: '700',
  fill: '#f8fafc',
})
</script>

<template>
  <FabricCanvas :canvas-options="{ preserveObjectStacking: true }">
    <FabricImage v-model="heroImage" preset="background" />
    <FabricText v-model="heroTitle" preset="headline" />
  </FabricCanvas>
</template>
`,
        footnotes: [
          richText(
            text('Model refs stay serializable—'),
            code('JSON.stringify'),
            text(' works because the components never mutate your source objects.'),
          ),
        ],
      },
      {
        id: 'fabric-canvas',
        title: 'FabricCanvas',
        description: richText(
          text('Wraps '),
          code('fabric.Canvas'),
          text(' with auto-resizing, preset orchestration, and sequential task queues.'),
        ),
        points: [
          richText(
            code('canvas-options'),
            text(' merges preset defaults → '),
            code('initial'),
            text(' overrides → the bound '),
            code('v-model'),
            text(' so you can progressively enhance configuration.'),
          ),
          richText(
            code('preset'),
            text(' loads entries from '),
            code('FABRIC_CANVAS_PRESETS'),
            text('; ship your own preset id to reuse curated options across pages.'),
          ),
          richText(
            code('auto-resize'),
            text(' keeps the canvas synced to its container via '),
            code('ResizeObserver'),
            text('. Disable it and set explicit '),
            code('width'),
            text('/'),
            code('height'),
            text(' for export-friendly stages.'),
          ),
          richText(
            code('pixel-ratio'),
            text(' overrides the device ratio so screenshots stay crisp on hidpi monitors.'),
          ),
          richText(
            text('Listen to '),
            code('@ready'),
            text(' for the underlying '),
            code('fabric.Canvas'),
            text(' and register custom tools or event handlers there.'),
          ),
        ],
        apiList: ['canvas-options', 'preset', 'initial', 'auto-resize', 'pixel-ratio', '@ready'],
        codeTitle: 'Custom canvas preset',
        codeLang: 'vue',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import type { Canvas } from 'fabric'
import type { FabricTextModelValue } from 'vue-fabric-fiber'
import { FabricCanvas, FabricText } from 'vue-fabric-fiber'

const headline = ref<FabricTextModelValue>({
  text: 'Storyboards stay deterministic',
  left: 80,
  top: 120,
  width: 480,
  fontSize: 48,
  fill: '#e2e8f0',
})

function handleCanvasReady(canvas: Canvas) {
  canvas.on('selection:created', () => {
    console.log('Selection created')
  })
}
</script>

<template>
  <FabricCanvas
    preset="storyboard"
    :initial="{ backgroundColor: '#020617' }"
    :canvas-options="{ selectionColor: 'rgba(56,189,248,0.12)' }"
    :pixel-ratio="2"
    @ready="handleCanvasReady"
  >
    <FabricText v-model="headline" />
  </FabricCanvas>
</template>
`,
        footnotes: [
          richText(
            text('Export '),
            code('FABRIC_CANVAS_PRESETS'),
            text(' or '),
            code('FABRIC_CANVAS_OPTION_KEYS'),
            text(' when you need to build custom inspectors or sync options with forms.'),
          ),
        ],
      },
      {
        id: 'fabric-image',
        title: 'FabricImage',
        description: plainRichText('Two-way bind Fabric image objects, including async loads, sizing strategies, and overlay controls.'),
        points: [
          richText(
            code('preset'),
            text(' chooses which props participate in '),
            code('v-model'),
            text(' (backgrounds ignore '),
            code('left/top'),
            text(', overlays keep everything).'),
          ),
          richText(
            code('width'),
            text('/'),
            code('height'),
            text(' accept numbers (px) or percentages that resolve against the canvas for responsive art.'),
          ),
          richText(
            text('Only the keys listed in '),
            code('FABRIC_IMAGE_BINDABLE_KEYS'),
            text(' are diffed; everything else can live in the preset’s '),
            code('initial'),
            text(' config.'),
          ),
          plainRichText('Model values remain plain objects, so you can hydrate them from APIs or persist them next to other scene data.'),
          richText(
            code('default'),
            text(' preset exposes all binding keys for general use, '),
            code('background'),
            text(' preset only mirrors '),
            code('src/width/height/opacity'),
            text(' for full-bleed art, and '),
            code('overlay'),
            text(' preset surfaces coordinates, transforms, and sizing so draggable layers feel natural.'),
          ),
        ],
        apiList: ['FabricImage', 'preset', 'FABRIC_IMAGE_PRESETS', 'FABRIC_IMAGE_BINDABLE_KEYS'],
        codeTitle: 'Overlay image preset',
        codeLang: 'vue',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import type { FabricImageModelValue } from 'vue-fabric-fiber'
import { FabricCanvas, FabricImage } from 'vue-fabric-fiber'

const background = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  width: '100%',
  height: '100%',
})

const accent = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  left: 420,
  top: 120,
  width: 320,
  angle: -8,
  selectable: true,
})
</script>

<template>
  <FabricCanvas>
    <FabricImage v-model="background" preset="background" />
    <FabricImage v-model="accent" preset="overlay" />
  </FabricCanvas>
</template>
`,
      },
      {
        id: 'fabric-text',
        title: 'FabricText',
        description: plainRichText('Bind typography-focused Fabric objects with presets for headlines, badges, and body copy.'),
        points: [
          richText(
            text('Every model requires a '),
            code('text'),
            text(' key; the rest of the props come from '),
            code('FABRIC_TEXT_OPTION_KEYS'),
            text('.'),
          ),
          richText(
            code('preset'),
            text(' limits which props sync through '),
            code('v-model'),
            text(' so inspectors cannot accidentally mutate low-level Fabric config.'),
          ),
          plainRichText('Use standard inputs (color pickers, sliders, dropdowns) against the same ref so both form and canvas stay in sync.'),
          richText(
            text('Pair with '),
            code('RenderGroup'),
            text(' to guarantee copy updates re-render in the right order.'),
          ),
        ],
        apiList: ['FabricText', 'preset', 'FABRIC_TEXT_PRESETS', 'FABRIC_TEXT_BINDABLE_KEYS'],
        codeTitle: 'Typography bindings',
        codeLang: 'vue',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import type { FabricTextModelValue } from 'vue-fabric-fiber'
import { FabricCanvas, FabricText } from 'vue-fabric-fiber'

const headline = ref<FabricTextModelValue>({
  text: 'Render queues over placeholders',
  left: 96,
  top: 140,
  width: 420,
  fontSize: 56,
  textAlign: 'left',
})

const badge = ref<FabricTextModelValue>({
  text: 'LIVE SYNC',
  left: 96,
  top: 80,
  fontSize: 18,
  fontWeight: '600',
  fill: '#0f172a',
  backgroundColor: '#facc15',
  padding: 12,
})
</script>

<template>
  <FabricCanvas :canvas-options="{ backgroundColor: '#020617' }">
    <FabricText v-model="badge" preset="badge" />
    <FabricText v-model="headline" preset="headline" />
  </FabricCanvas>
</template>
`,
      },
      {
        id: 'render-group',
        title: 'RenderGroup',
        description: plainRichText('Queue asynchronous work so Fabric objects mount in deterministic order.'),
        points: [
          richText(
            text('Every '),
            code('<RenderGroup>'),
            text(' inherits the canvas task queue and schedules object creation sequentially.'),
          ),
          richText(
            code('priority'),
            text(' reorders the queue (lower priority runs first), which helps keep overlays above async imagery.'),
          ),
          richText(
            code('disable-queue'),
            text(' bypasses ordering when you need to mutate an object immediately (e.g., dragging guides).'),
          ),
          plainRichText('Nested groups share the same context, so you can isolate expensive sections without rebuilding the canvas.'),
        ],
        apiList: ['RenderGroup', 'priority', 'disable-queue'],
        codeTitle: 'Deterministic layering',
        codeLang: 'vue',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import type { FabricImageModelValue, FabricTextModelValue } from 'vue-fabric-fiber'
import { FabricCanvas, FabricImage, FabricText, RenderGroup } from 'vue-fabric-fiber'

const background = ref<FabricImageModelValue>({
  src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  width: '100%',
  height: '100%',
})

const title = ref<FabricTextModelValue>({
  text: 'Queued layers never flicker',
  left: 120,
  top: 180,
  fontSize: 54,
  width: 420,
})
</script>

<template>
  <FabricCanvas>
    <RenderGroup :priority="1">
      <FabricImage v-model="background" preset="background" />
    </RenderGroup>
    <RenderGroup :priority="10">
      <FabricText v-model="title" preset="headline" />
    </RenderGroup>
  </FabricCanvas>
</template>
`,
        footnotes: [
          plainRichText('Queues prevent async images from jumping ahead of text nodes, which keeps complex hero layouts stable.'),
        ],
      },
      {
        id: 'shapes',
        title: 'Geometry helpers',
        description: richText(
          text('Rectangles, circles, lines, polygons, and custom paths share the same reactive '),
          code('v-model'),
          text(' pattern.'),
        ),
        points: [
          richText(
            text('Every shape component is generated by '),
            code('createFabricObjectComponent'),
            text(', so updates flow through the same diffing pipeline.'),
          ),
          richText(
            text('Model values match Fabric’s props (e.g., '),
            code('FabricRectModelValue'),
            text(', '),
            code('FabricCircleModelValue'),
            text('), letting you author overlays or guides as JSON.'),
          ),
          richText(
            text('Shapes respect the surrounding '),
            code('RenderGroup'),
            text(', making it easy to stack data visualizations or guides atop imagery.'),
          ),
        ],
        apiList: ['FabricRect', 'FabricCircle', 'FabricPolygon', 'FabricLine'],
        codeTitle: 'Shape overlays',
        codeLang: 'vue',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import type { FabricRectModelValue, FabricCircleModelValue } from 'vue-fabric-fiber'
import { FabricCanvas, FabricRect, FabricCircle } from 'vue-fabric-fiber'

const frame = ref<FabricRectModelValue>({
  left: 80,
  top: 80,
  width: 520,
  height: 320,
  stroke: '#38bdf8',
  strokeWidth: 2,
  fill: 'transparent',
})

const focus = ref<FabricCircleModelValue>({
  left: 260,
  top: 200,
  radius: 90,
  fill: 'rgba(56,189,248,0.12)',
  stroke: '#38bdf8',
})
</script>

<template>
  <FabricCanvas :canvas-options="{ backgroundColor: '#020617' }">
    <FabricRect v-model="frame" />
    <FabricCircle v-model="focus" />
  </FabricCanvas>
</template>
`,
      },
    ],
  },
} as const

export default en
