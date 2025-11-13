import type { Canvas } from 'fabric'
import type { ComputedRef, Ref } from 'vue'
import type {
  FabricImageModelValue,
  FabricTextModelValue,
} from '~/index'
import { Shadow } from 'fabric'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import heroBackgroundSrc from '@/assets/interactive/hero-background.webp'
import heroPortraitSrc from '@/assets/interactive/hero-portrait.webp'
import { bindCanvasDragBounds } from '@/utils/canvasBounds'

export interface HeroSceneState {
  heroCanvasDimensions: { width: number, height: number }
  heroCanvasStyle: { aspectRatio: string, minHeight: string, width: string }
  heroCanvasPixelRatio: number
  heroCanvasImage: Ref<FabricImageModelValue>
  accentPortraitImage: Ref<FabricImageModelValue>
  textArray: Ref<HeroTextLayer[]>
  renderGroupTitle: Ref<FabricTextModelValue>
  renderGroupGreeting: Ref<FabricTextModelValue>
  selectedTextIndex: Ref<number>
  activeTextLayer: ComputedRef<HeroTextLayer | null>
  textLayerOptions: ComputedRef<Array<{ label: string, value: number, preview: string }>>
  handleHeroCanvasReady: (canvas: Canvas) => void
}

interface UseHeroSceneOptions {
  t: (key: string, ...args: any[]) => string
  tm: (...args: any[]) => unknown
  locale: Ref<string>
}

type HeroTextLayer = Omit<FabricTextModelValue, 'clipPath' | 'canvas' | 'path'>

export function useHeroScene({ t, tm, locale }: UseHeroSceneOptions): HeroSceneState {
  const heroCanvasDimensions = {
    width: 720,
    height: 520,
  } as const
  const baseWidth = heroCanvasDimensions.width
  const baseHeight = heroCanvasDimensions.height

  const heroCanvasPixelRatio
    = typeof window === 'undefined'
      ? 2
      : Math.min(Math.max(window.devicePixelRatio || 1, 1.75), 3)

  const heroCanvasStyle = {
    aspectRatio: `${heroCanvasDimensions.width} / ${heroCanvasDimensions.height}`,
    minHeight: `${heroCanvasDimensions.height}px`,
    width: '100%',
  } as const

  const heroCanvasImage = ref<FabricImageModelValue>({
    src: heroBackgroundSrc,
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    scaleX: 0,
    scaleY: 0,
    selectable: false,
    hasControls: false,
    evented: false,
  })

  const accentPortraitImage = ref<FabricImageModelValue>({
    src: heroPortraitSrc,
    width: 580,
    height: 400,
    left: baseWidth * 0.82,
    top: baseHeight * 0.44,
    angle: -10,
    selectable: true,
    hasControls: true,
    shadow: new Shadow({
      color: 'rgba(2,6,23,0.45)',
      blur: 26,
      offsetX: 0,
      offsetY: 22,
    }),
  })

  const heroTitleShadow = new Shadow({
    color: 'rgba(15,23,42,0.65)',
    blur: 18,
    offsetX: 0,
    offsetY: 0,
  })

  function getHeadlineTexts(): string[] {
    const values = tm('home.hero.canvasCopy.headline')
    return Array.isArray(values) ? values.map(value => String(value)) : []
  }

  const initialHeadlines = getHeadlineTexts()
  const fallbackHeadlines: [string, string, string, string] = [
    initialHeadlines[0] ?? 'Fabric Ports Studio',
    initialHeadlines[1] ?? 'Declarative canvas operating system',
    initialHeadlines[2] ?? 'Live bindings · Scene graph · Render queues',
    initialHeadlines[3] ?? 'Adaptive render queues at scale',
  ]
  const centerHeadlineWidth = baseWidth * 0.48
  const lowerBodyWidth = baseWidth * 0.66

  const textArray = ref<HeroTextLayer[]>([
    {
      text: fallbackHeadlines[0],
      left: baseWidth * 0.12,
      top: baseHeight * 0.12,
      fontSize: 82,
      fill: '#f8fafc',
      fontFamily: 'Inter',
      fontWeight: '700',
      shadow: heroTitleShadow,
      selectable: true,
      hasControls: true,
    },
    {
      text: fallbackHeadlines[1],
      left: (baseWidth - centerHeadlineWidth) / 2,
      top: baseHeight * 0.32,
      fontSize: 56,
      fill: '#cbd5f5',
      fontFamily: 'Inter',
      fontWeight: '500',
      textAlign: 'center',
      width: centerHeadlineWidth,
      selectable: true,
      hasControls: true,
    },
    {
      text: fallbackHeadlines[2],
      left: (baseWidth - lowerBodyWidth) / 2,
      top: baseHeight * 0.72,
      width: lowerBodyWidth,
      fontSize: 44,
      fill: '#e2e8f0',
      fontFamily: 'Inter',
      fontWeight: '600',
      lineHeight: 1.4,
      textAlign: 'left',
      selectable: true,
      hasControls: true,
    },
    {
      text: fallbackHeadlines[3],
      left: (baseWidth - centerHeadlineWidth) / 2,
      top: baseHeight * 0.86,
      fontSize: 36,
      fill: '#38bdf8',
      fontFamily: 'Inter',
      fontWeight: '600',
      width: centerHeadlineWidth,
      textAlign: 'center',
      selectable: true,
      hasControls: true,
    },
  ])

  const renderGroupTitle = ref<FabricTextModelValue>({
    text: t('home.hero.canvasCopy.queueTitle'),
    left: (baseWidth - lowerBodyWidth) / 2,
    top: baseHeight * 0.54,
    fontSize: 44,
    fill: '#fbbf24',
    fontFamily: 'Inter',
    fontWeight: '600',
    width: lowerBodyWidth,
    textAlign: 'center',
    selectable: true,
    hasControls: true,
  })

  const renderGroupGreeting = ref<FabricTextModelValue>({
    text: t('home.hero.canvasCopy.queueStatus'),
    left: (baseWidth - lowerBodyWidth) / 2,
    top: baseHeight * 0.62,
    fontSize: 34,
    fill: '#f8fafc',
    fontFamily: 'Inter',
    fontWeight: '500',
    width: lowerBodyWidth,
    textAlign: 'center',
    selectable: true,
    hasControls: true,
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
    heroCanvasPixelRatio,
    heroCanvasImage,
    accentPortraitImage,
    textArray,
    renderGroupTitle,
    renderGroupGreeting,
    selectedTextIndex,
    activeTextLayer,
    textLayerOptions,
    handleHeroCanvasReady,
  }
}
