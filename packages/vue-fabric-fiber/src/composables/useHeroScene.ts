import type { Canvas } from 'fabric'
import type { ComputedRef, Ref } from 'vue'
import type { Composer } from 'vue-i18n'
import type { MessageSchema, SupportedLocale } from '@/i18n'
import type {
  FabricImageModelValue,
  FabricTextModelValue,
} from '~/index'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
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
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    selectable: false,
    hasControls: false,
    evented: false,
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
