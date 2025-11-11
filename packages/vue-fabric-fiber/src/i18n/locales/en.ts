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
} as const

export default en
