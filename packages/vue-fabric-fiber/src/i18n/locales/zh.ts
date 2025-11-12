import { code, plainRichText, richText, text } from '../richText'

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
      docs: '文档',
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
      lightMode: '切换到亮色模式',
      darkMode: '切换到暗色模式',
      lightModeShort: '亮色',
      darkModeShort: '暗色',
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
  docs: {
    meta: {
      title: '文档',
      description: 'vue-fabric-fiber 组件与 Fabric.js 绑定的使用指南。',
      keywords: ['vue-fabric-fiber 文档', 'FabricCanvas 属性', 'RenderGroup 队列', 'FabricImage 绑定'],
    },
    hero: {
      eyebrow: '使用文档',
      title: 'vue-fabric-fiber 组件参考',
      description: '了解 FabricCanvas、FabricImage、FabricText、RenderGroup 以及几何辅助组件的行为，放心构建画布体验。',
      quickLinksLabel: '章节',
    },
    sections: [
      {
        id: 'getting-started',
        title: '快速上手',
        description: plainRichText('所有绑定都是标准的 Vue 组件：安装依赖、创建响应式模型，然后把组件放进任意 SFC 即可。'),
        points: [
          richText(
            text('运行 '),
            code('pnpm add vue-fabric-fiber'),
            text(' 并按需导入组件，各个导出都是可 tree-shake 的 ES 模块。'),
          ),
          richText(
            text('画布状态保存在 '),
            code('ref'),
            text(' 中，并满足 '),
            code('FabricImageModelValue'),
            text('、'),
            code('FabricTextModelValue'),
            text(' 等类型，因此可以直接用 JSON 还原或持久化。'),
          ),
          plainRichText('常规的表单控件、watcher 都能驱动这些 ref；绑定层会负责 diff 并把变更同步到 Fabric 对象。'),
        ],
        apiList: ['FabricCanvas', 'FabricImage', 'FabricText'],
        codeTitle: '最小画布',
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
            text('组件不会直接修改你的 ref，因此可以安全地 '),
            code('JSON.stringify'),
            text(' 并存储整个场景。'),
          ),
        ],
      },
      {
        id: 'fabric-canvas',
        title: 'FabricCanvas',
        description: richText(
          text('在 '),
          code('fabric.Canvas'),
          text(' 之上提供自动缩放、预设管理与顺序任务队列。'),
        ),
        points: [
          richText(
            code('canvas-options'),
            text(' 会依次合并预设默认值 → '),
            code('initial'),
            text(' → 当前绑定值，方便渐进式扩展配置。'),
          ),
          richText(
            code('preset'),
            text(' 读取 '),
            code('FABRIC_CANVAS_PRESETS'),
            text('，自定义 id 即可在多页之间复用设置。'),
          ),
          richText(
            code('auto-resize'),
            text(' 通过 '),
            code('ResizeObserver'),
            text(' 同步容器尺寸；如需固定导出大小，可关闭并手动设置 '),
            code('width'),
            text('/'),
            code('height'),
            text('。'),
          ),
          richText(
            code('pixel-ratio'),
            text(' 覆盖设备 DPR，保证高清屏幕上的截图质量。'),
          ),
          richText(
            text('监听 '),
            code('@ready'),
            text(' 获取底层 '),
            code('fabric.Canvas'),
            text('，然后注册自定义工具或事件。'),
          ),
        ],
        apiList: ['canvas-options', 'preset', 'initial', 'auto-resize', 'pixel-ratio', '@ready'],
        codeTitle: '自定义预设',
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
            text('使用导出的 '),
            code('FABRIC_CANVAS_PRESETS'),
            text(' 与 '),
            code('FABRIC_CANVAS_OPTION_KEYS'),
            text(' 可以快速构建自定义检查器。'),
          ),
        ],
      },
      {
        id: 'fabric-image',
        title: 'FabricImage',
        description: plainRichText('双向绑定 Fabric 图像对象，涵盖异步加载、尺寸策略与叠加控制。'),
        points: [
          richText(
            code('preset'),
            text(' 决定哪些字段参与 '),
            code('v-model'),
            text('（背景忽略位置，叠加层保留所有坐标信息）。'),
          ),
          richText(
            code('width'),
            text('/'),
            code('height'),
            text(' 可填像素值或百分比，百分比会基于画布尺寸计算，用于响应式背景。'),
          ),
          richText(
            text('只有 '),
            code('FABRIC_IMAGE_BINDABLE_KEYS'),
            text(' 中的键会被 diff，其余配置可放在预设的 '),
            code('initial'),
            text(' 中。'),
          ),
          plainRichText('模型值是普通对象，方便与后端接口或本地存储互通。'),
          richText(
            code('default'),
            text(' 预设暴露全部键值，适合通用图层；'),
            code('background'),
            text(' 仅同步 '),
            code('src/width/height/opacity'),
            text('，方便铺满背景；'),
            code('overlay'),
            text(' 则保留位置、尺寸与变换字段，让可拖拽叠加层体验自然。'),
          ),
        ],
        apiList: ['FabricImage', 'preset', 'FABRIC_IMAGE_PRESETS', 'FABRIC_IMAGE_BINDABLE_KEYS'],
        codeTitle: '叠加图像',
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
        description: plainRichText('用于标题、徽章与正文的文字组件，拥有多套预设。'),
        points: [
          richText(
            text('模型必须包含 '),
            code('text'),
            text(' 字段，其余属性来自 '),
            code('FABRIC_TEXT_OPTION_KEYS'),
            text('。'),
          ),
          richText(
            code('preset'),
            text(' 限制可双向绑定的字段，避免误改底层 Fabric 配置。'),
          ),
          plainRichText('使用常规的输入框、颜色选择器、滑块即可驱动同一个 ref，从而同时更新画布与表单。'),
          richText(
            text('与 '),
            code('RenderGroup'),
            text(' 配合可保证文案更新时的渲染顺序。'),
          ),
        ],
        apiList: ['FabricText', 'preset', 'FABRIC_TEXT_PRESETS', 'FABRIC_TEXT_BINDABLE_KEYS'],
        codeTitle: '排版绑定',
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
        description: plainRichText('将异步任务排队，确保对象按确定顺序挂载。'),
        points: [
          richText(
            text('每个 '),
            code('<RenderGroup>'),
            text(' 都接入画布的任务队列，串行创建 Fabric 对象。'),
          ),
          richText(
            code('priority'),
            text(' 可以重新排序（数值越小越早执行），用来保持叠加层始终位于背景之上。'),
          ),
          richText(
            code('disable-queue'),
            text(' 会跳过队列，适合需要立即响应的交互（例如拖拽辅助线）。'),
          ),
          plainRichText('嵌套的分组共享同一上下文，可针对昂贵区域单独排队。'),
        ],
        apiList: ['RenderGroup', 'priority', 'disable-queue'],
        codeTitle: '确定性的层叠',
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
        footnotes: [plainRichText('队列能阻止异步图像盖到文字前面，非常适合复杂主视觉。')],
      },
      {
        id: 'shapes',
        title: '几何组件',
        description: richText(
          text('矩形、圆形、折线、多边形与路径都遵守同一套 '),
          code('v-model'),
          text(' 约定。'),
        ),
        points: [
          richText(
            text('所有图形组件都由 '),
            code('createFabricObjectComponent'),
            text(' 生成，更新会经过相同的 diff 流程。'),
          ),
          richText(
            text('模型类型与 Fabric 原生属性一致，例如 '),
            code('FabricRectModelValue'),
            text('、'),
            code('FabricCircleModelValue'),
            text('，便于用 JSON 定义辅助线。'),
          ),
          richText(
            text('图形也能参加 '),
            code('RenderGroup'),
            text(' 的排序，方便在图像之上叠加可视化或命中区域。'),
          ),
        ],
        apiList: ['FabricRect', 'FabricCircle', 'FabricPolygon', 'FabricLine'],
        codeTitle: '形状覆盖层',
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

export default zh
