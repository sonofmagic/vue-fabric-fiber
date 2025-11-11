const zh = {
  locale: {
    label: '语言',
    options: {
      en: '英文',
      zh: '中文',
    },
  },
  app: {
    brand: {
      tagline: '演示工作室',
    },
    nav: {
      overview: '概览',
      demos: '演示',
      github: 'GitHub',
      toggle: '切换导航',
    },
    footer: {
      builtWith: '基于 Fabric.js 的 Vue 绑定构建。',
      copyright: '© {year} Fabric Ports',
    },
    actions: {
      close: '关闭',
      viewDemo: '查看演示',
      viewAllDemos: '查看全部演示',
      exploreHeroBuilder: '探索主视觉构建器',
      typographyCanvas: '排版画布',
      enterInteractive: '进入交互模式',
      exitInteractive: '退出交互模式',
    },
  },
  components: {
    demoRepl: {
      errorTitle: '加载沙盒失败：',
      loading: '正在准备交互沙盒…',
    },
  },
  home: {
    meta: {
      title: '概览',
      description: '借助 Fabric Ports 在 Vue 中声明式构建 Fabric.js 画布，享受类型安全的绑定以及实时 JSON 编辑器。',
      keywords: ['fabric.js', 'vue 3', '画布绑定', 'RenderGroup', 'JSON 编辑器', '设计工具'],
    },
    hero: {
      eyebrow: 'Vue + Fabric.js',
      title: '用实时数据契约打造多层 Fabric 画布',
      description:
        '在一个 Vue 文件里兼顾美感与可观测性。下方的主视觉场景融合了背景图像、渐变图块、徽章与 RenderGroup 队列——所有内容都可通过同步的 JSON 检查器编辑。',
      highlightsTitle: '为什么选择 Fabric Ports',
      highlights: [
        {
          title: '场景图始终可视化',
          description: '在同一个模板中混合图像、渐变与图元。每个 Fabric 对象都用 Vue 声明，因此场景图读起来就像组件树。',
        },
        {
          title: '检查器实时映射每次调整',
          description: '拖动画布元素即可看到 JSON 检查器同步更新，也可直接修改数据载荷来驱动精确的坐标或尺寸。',
        },
        {
          title: '渲染顺序保持可控',
          description: 'RenderGroup 队列串行化异步资源与叠加图像，确保大型主视觉在资源加载时不会闪烁或乱序。',
        },
      ],
      stats: [
        { label: '节点', value: '12 个交互对象' },
        { label: '延迟', value: '小于 16ms 更新' },
        { label: '预设', value: '5 套画布方案' },
      ],
      layerTypes: {
        image: '图像',
        text: '文字',
        rect: '矩形',
        circle: '圆形',
      },
      layerLabels: {
        heroImage: '主视觉图片',
        accentPortrait: '装饰肖像',
        renderGroupTitle: 'RenderGroup 标题',
        renderGroupGreeting: 'RenderGroup 状态',
        glowTile: '辉光图块 {index}',
        copyLayer: '文案图层 {index}',
        halo: '脉冲光环',
      },
      layerSummaries: {
        heroFallback: 'Unsplash 图源',
        accentFallback: '叠加图源',
        glowTile: '尺寸 {width} · 坐标 ({left}, {top})',
        halo: '半径 {radius}px',
      },
      canvasCopy: {
        headline: ['Fabric Ports Studio', '声明式画布操作系统', '实时绑定 · 场景图 · 渲染队列'],
        queueTitle: '渲染队列已锁定',
        queueStatus: '● 正在同步图层',
      },
      interactive: {
        eyebrow: '主视觉沙盒',
        title: '实时画布编排器',
        description: '无需离开浏览器即可试验主视觉。切换交互模式可拆分视图，同时保留画布与控制面板。',
        toggle: {
          enter: '进入交互模式',
          exit: '退出交互模式',
        },
        closeLabel: '关闭',
        panel: {
          title: '画布检查器',
          description: '调整图像、队列文案与标题层。输入与 Fabric 引用直接映射，每次改动都会实时刷新主视觉。',
        },
        portrait: {
          title: '肖像叠加',
          type: '图像',
          fields: {
            left: 'X 坐标 (px)',
            top: 'Y 坐标 (px)',
            width: '宽度 (px)',
            angle: '角度 (°)',
          },
        },
        headline: {
          title: '标题图层',
          type: '文字',
          fields: {
            selectLabel: '图层',
            copy: '文案',
            fontSize: '字号',
            color: '颜色',
            left: 'X 坐标 (px)',
            top: 'Y 坐标 (px)',
          },
          empty: '添加一个标题图层即可开始编辑文案。',
        },
        halo: {
          title: '光环与队列文案',
          type: '组合',
          fields: {
            queueTitle: '队列标题',
            titleColor: '标题颜色',
            queueStatus: '队列状态',
            statusColor: '状态颜色',
          },
        },
      },
      featured: {
        eyebrow: '探索',
        title: '演示画廊',
        description: '深入体验各类专用画布：测试排版绑定、叠加异步资源或组合几何图元。每个演示都贴近真实生产配置。',
      },
    },
  },
  demos: {
    meta: {
      keywords: ['fabric.js 演示', 'Vue 画布示例', 'RenderGroup 画廊'],
    },
    hero: {
      eyebrow: '演示画廊',
      title: '探索 vue-fabric-fiber 画布',
      description:
        '浏览一组重新用 Vue 绑定构建的 Fabric.js 示例。每个页面都聚焦自定义对象、层叠场景、排版绑定等特定集成模式。',
    },
    tags: {
      text: '文本',
      image: '图像',
      reactive: '响应式',
      animation: '动画',
      customObject: '自定义对象',
      json: 'JSON',
      dynamicScenes: '动态场景',
      typography: '排版',
      bindings: '绑定',
      renderGroup: 'RenderGroup',
      layers: '图层',
      shapes: '图形',
      primitives: '基础图元',
    },
    cards: {
      basic: {
        title: '基础主视觉横幅',
        description: '在异步加载的图像上叠加文本，并实时微调布局控制。',
        tags: ['text', 'image', 'reactive'],
      },
      animatingCrosses: {
        title: '十字交叉动画',
        description: '通过组件化对象与调色控制复刻 Fabric 的经典十字动画。',
        tags: ['animation', 'customObject'],
      },
      playground: {
        title: '代码操场',
        description: '编辑场景蓝图，并立即根据 JSON 指令渲染 Fabric 组件。',
        tags: ['json', 'dynamicScenes'],
      },
      textPlayground: {
        title: '文字互动实验',
        description: '将滑块、输入与开关直接绑定到 FabricText 属性，实时查看画布响应。',
        tags: ['typography', 'bindings'],
      },
      composite: {
        title: '层叠合成',
        description: '组合 RenderGroup 队列来编排可切换的复杂场景。',
        tags: ['renderGroup', 'layers'],
      },
      shapes: {
        title: '形状工具箱',
        description: '使用 Fabric 形状组件创建矩形、多段线、路径等基础图元。',
        tags: ['shapes', 'primitives'],
      },
    },
    detail: {
      common: {
        eyebrow: '实时沙盒',
      },
      helpers: {
        basic: '在编辑器内切换主视觉图片、排版与选区属性，同时保持 Fabric 画布的响应性。',
        animatingCrosses: '借助自定义对象、调色板控制与画布级侦听还原 Fabric 的经典动画。',
        playground: '粘贴 JSON 场景描述、切换预设，并观察 Fabric 如何根据数据层指令渲染。',
        textPlayground: '把滑块、输入与切换直接绑定到 FabricText 属性，每次敲击都能看到画布更新。',
        composite: 'RenderGroup 队列、异步图像与可切换图层保持同步，便于研究绑定如何编排复杂场景。',
        shapes: '从矩形、多边形到自定义路径，所有基础图元都使用同一套 Fabric 绑定，方便安全复用。',
      },
      notes: {
        basic: {
          intro: '代码位于 ',
          outro: '，在内嵌的 @vue/repl 中编辑即可同时查看源码与画布输出。',
        },
        animatingCrosses: {
          intro: 'REPL 会加载 ',
          outro: '，让你无需离开页面即可探索动画对象的实现。',
        },
        playground: {
          intro: '编辑器会载入 ',
          outro: '，方便你迭代驱动控制面板的场景蓝图。',
        },
        textPlayground: {
          intro: '使用 ',
          outro: '，在 REPL 中即可同时调整文案、渐变与输入绑定，并观察画布反馈。',
        },
        composite: {
          intro: '直接编辑 ',
          outro: '，即可理解每个 RenderGroup 插槽如何驱动 Fabric 画布。',
        },
        shapes: {
          intro: '探索 ',
          outro: '，了解每个基础图元如何在 @vue/repl 内映射到 Fabric.js API。',
        },
      },
    },
  },
} as const

export default zh
