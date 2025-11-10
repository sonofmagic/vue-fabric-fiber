import type { Canvas } from 'fabric'
import type { ComputedRef, Ref } from 'vue'
import type { Composer } from 'vue-i18n'
import type { MessageSchema, SupportedLocale } from '@/i18n'
import type {
  FabricCircleModelValue,
  FabricImageModelValue,
  FabricRectModelValue,
  FabricTextModelValue,
} from '~/index'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { bindCanvasDragBounds } from '@/utils/canvasBounds'

export interface HeroInspectorLayer {
  id: string
  label: string
  type: string
  summary: string
}

export interface HeroSceneState {
  heroCanvasDimensions: { width: number, height: number }
  heroCanvasStyle: { aspectRatio: string, minHeight: string, width: string }
  heroCanvasImage: Ref<FabricImageModelValue>
  accentPortraitImage: Ref<FabricImageModelValue>
  layoutPanels: Ref<FabricRectModelValue[]>
  haloCircle: Ref<FabricCircleModelValue>
  textArray: Ref<HeroTextLayer[]>
  renderGroupTitle: Ref<FabricTextModelValue>
  renderGroupGreeting: Ref<FabricTextModelValue>
  inspectorLayers: ComputedRef<HeroInspectorLayer[]>
  selectedTextIndex: Ref<number>
  activeTextLayer: ComputedRef<HeroTextLayer | null>
  textLayerOptions: ComputedRef<Array<{ label: string, value: number, preview: string }>>
  handleHeroCanvasReady: (canvas: Canvas) => void
}

interface UseHeroSceneOptions {
  t: Composer<MessageSchema, SupportedLocale>['t']
  tm: Composer<MessageSchema, SupportedLocale>['tm']
  locale: Composer<MessageSchema, SupportedLocale>['locale']
}

type HeroTextLayer = Omit<FabricTextModelValue, 'clipPath' | 'canvas' | 'path'>

export function useHeroScene({ t, tm, locale }: UseHeroSceneOptions): HeroSceneState {
  const heroCanvasDimensions = {
    width: 720,
    height: 520,
  } as const

  const heroCanvasStyle = {
    aspectRatio: `${heroCanvasDimensions.width} / ${heroCanvasDimensions.height}`,
    minHeight: `${heroCanvasDimensions.height}px`,
    width: '100%',
  } as const

  const heroCanvasImage = ref<FabricImageModelValue>({
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    width: heroCanvasDimensions.width,
    height: heroCanvasDimensions.height,
    selectable: true,
    hasControls: true,
  })

  const accentPortraitImage = ref<FabricImageModelValue>({
    src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80',
    width: 220,
    left: 420,
    top: 150,
    angle: -4,
    selectable: true,
    hasControls: true,
    shadow: {
      color: 'rgba(2,6,23,0.55)',
      blur: 18,
      offsetX: 0,
      offsetY: 16,
    },
  })

  const layoutPanels = ref<FabricRectModelValue[]>([
    {
      left: 360,
      top: 70,
      width: 220,
      height: 130,
      rx: 32,
      ry: 32,
      fill: 'rgba(15,23,42,0.78)',
      stroke: '#38bdf8',
      strokeWidth: 2,
      opacity: 0.9,
      selectable: true,
      hasControls: true,
    },
    {
      left: 520,
      top: 240,
      width: 160,
      height: 120,
      rx: 28,
      ry: 28,
      fill: 'rgba(2,132,199,0.22)',
      stroke: '#22d3ee',
      strokeWidth: 1.5,
      opacity: 0.85,
      selectable: true,
      hasControls: true,
    },
    {
      left: 360,
      top: 230,
      width: 110,
      height: 180,
      rx: 26,
      ry: 26,
      fill: 'rgba(76,29,149,0.18)',
      stroke: '#a855f7',
      strokeDashArray: [8, 6],
      strokeWidth: 1.5,
      opacity: 0.75,
      selectable: true,
      hasControls: true,
    },
  ])

  const haloCircle = ref<FabricCircleModelValue>({
    left: 500,
    top: 280,
    radius: 130,
    fill: 'rgba(6,182,212,0.18)',
    stroke: '#22d3ee',
    strokeWidth: 2,
    strokeDashArray: [10, 6],
    selectable: true,
    hasControls: true,
  })

  const heroTitleShadow = {
    color: 'rgba(15,23,42,0.65)',
    blur: 14,
    offsetX: 2,
    offsetY: 2,
  }

  function getHeadlineTexts(): string[] {
    const values = tm('home.hero.canvasCopy.headline')
    return Array.isArray(values) ? values.map(value => String(value)) : []
  }

  const initialHeadlines = getHeadlineTexts()

  const textArray = ref<HeroTextLayer[]>([
    {
      text: initialHeadlines[0] ?? '',
      left: 66,
      top: 120,
      fontSize: 64,
      fill: '#f8fafc',
      fontFamily: 'Inter',
      fontWeight: '700',
      shadow: heroTitleShadow,
      selectable: true,
      hasControls: true,
    },
    {
      text: initialHeadlines[1] ?? '',
      left: 70,
      top: 205,
      fontSize: 30,
      fill: '#cbd5f5',
      fontFamily: 'Inter',
      fontWeight: '500',
      selectable: true,
      hasControls: true,
    },
    {
      text: initialHeadlines[2] ?? '',
      left: 70,
      top: 265,
      fontSize: 22,
      fill: '#38bdf8',
      fontFamily: 'Inter',
      fontWeight: '600',
      selectable: true,
      hasControls: true,
    },
  ])

  const renderGroupTitle = ref<FabricTextModelValue>({
    text: t('home.hero.canvasCopy.queueTitle'),
    left: 420,
    top: 360,
    fontSize: 30,
    fill: '#fbbf24',
    fontFamily: 'Inter',
    fontWeight: '600',
    selectable: true,
    hasControls: true,
  })

  const renderGroupGreeting = ref<FabricTextModelValue>({
    text: t('home.hero.canvasCopy.queueStatus'),
    left: 430,
    top: 410,
    fontSize: 28,
    fill: '#f8fafc',
    fontFamily: 'Inter',
    fontWeight: '500',
    selectable: true,
    hasControls: true,
  })

  const inspectorLayers = computed<HeroInspectorLayer[]>(() => {
    const layers: HeroInspectorLayer[] = [
      {
        id: 'hero-image',
        label: t('home.hero.layerLabels.heroImage'),
        type: t('home.hero.layerTypes.image'),
        summary: heroCanvasImage.value.src?.split('?')[0] ?? t('home.hero.layerSummaries.heroFallback'),
      },
      {
        id: 'accent-portrait',
        label: t('home.hero.layerLabels.accentPortrait'),
        type: t('home.hero.layerTypes.image'),
        summary: accentPortraitImage.value.src?.split('?')[0] ?? t('home.hero.layerSummaries.accentFallback'),
      },
      {
        id: 'render-group-title',
        label: t('home.hero.layerLabels.renderGroupTitle'),
        type: t('home.hero.layerTypes.text'),
        summary: renderGroupTitle.value.text,
      },
      {
        id: 'render-group-greeting',
        label: t('home.hero.layerLabels.renderGroupGreeting'),
        type: t('home.hero.layerTypes.text'),
        summary: renderGroupGreeting.value.text,
      },
    ]

    layoutPanels.value.forEach((panel, index) => {
      layers.push({
        id: `glow-tile-${index}`,
        label: t('home.hero.layerLabels.glowTile', { index: index + 1 }),
        type: t('home.hero.layerTypes.rect'),
        summary: t('home.hero.layerSummaries.glowTile', {
          width: `${panel.width ?? 0}×${panel.height ?? 0}px`,
          left: panel.left ?? 0,
          top: panel.top ?? 0,
        }),
      })
    })

    layers.push({
      id: 'halo-circle',
      label: t('home.hero.layerLabels.halo'),
      type: t('home.hero.layerTypes.circle'),
      summary: t('home.hero.layerSummaries.halo', { radius: haloCircle.value.radius ?? 0 }),
    })

    textArray.value.forEach((entry, index) => {
      layers.push({
        id: `copy-${index}`,
        label: t('home.hero.layerLabels.copyLayer', { index: index + 1 }),
        type: t('home.hero.layerTypes.text'),
        summary: entry.text,
      })
    })

    return layers
  })

  const selectedTextIndex = ref(0)
  const activeTextLayer = computed<HeroTextLayer | null>(() => {
    return textArray.value[selectedTextIndex.value] ?? textArray.value[0] ?? null
  })

  const textLayerOptions = computed(() => {
    return textArray.value.map((layer, index) => ({
      label: t('home.hero.layerLabels.copyLayer', { index: index + 1 }),
      value: index,
      preview: layer.text,
    }))
  })

  watch(locale, () => {
    const updatedHeadlines = getHeadlineTexts()
    textArray.value.forEach((entry, index) => {
      entry.text = updatedHeadlines[index] ?? entry.text
    })
    renderGroupTitle.value.text = t('home.hero.canvasCopy.queueTitle')
    renderGroupGreeting.value.text = t('home.hero.canvasCopy.queueStatus')
  })

  const detachHeroCanvasBounds = ref<VoidFunction | null>(null)

  function handleHeroCanvasReady(canvas: Canvas) {
    detachHeroCanvasBounds.value?.()
    detachHeroCanvasBounds.value = bindCanvasDragBounds(canvas)
  }

  onBeforeUnmount(() => {
    detachHeroCanvasBounds.value?.()
  })

  return {
    heroCanvasDimensions,
    heroCanvasStyle,
    heroCanvasImage,
    accentPortraitImage,
    layoutPanels,
    haloCircle,
    textArray,
    renderGroupTitle,
    renderGroupGreeting,
    inspectorLayers,
    selectedTextIndex,
    activeTextLayer,
    textLayerOptions,
    handleHeroCanvasReady,
  }
}
