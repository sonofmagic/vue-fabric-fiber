export type DemoCardSlug
  = | 'basic'
    | 'animatingCrosses'
    | 'playground'
    | 'textPlayground'
    | 'composite'
    | 'shapes'
    | 'hiResDrawing'
    | 'pdfWatermark'

export type DemoTagKey
  = | 'text'
    | 'image'
    | 'reactive'
    | 'animation'
    | 'customObject'
    | 'json'
    | 'dynamicScenes'
    | 'typography'
    | 'bindings'
    | 'renderGroup'
    | 'layers'
    | 'shapes'
    | 'primitives'
    | 'drawing'
    | 'export'

export interface DemoCard {
  slug: DemoCardSlug
  to: string
  titleKey: `demos.cards.${DemoCardSlug}.title`
  descriptionKey: `demos.cards.${DemoCardSlug}.description`
  tagKeys?: DemoTagKey[]
}

export const demoCards: DemoCard[] = [
  {
    slug: 'basic',
    to: '/demos/basic',
    titleKey: 'demos.cards.basic.title',
    descriptionKey: 'demos.cards.basic.description',
    tagKeys: ['text', 'image', 'reactive'],
  },
  {
    slug: 'animatingCrosses',
    to: '/demos/animating-crosses',
    titleKey: 'demos.cards.animatingCrosses.title',
    descriptionKey: 'demos.cards.animatingCrosses.description',
    tagKeys: ['animation', 'customObject'],
  },
  {
    slug: 'playground',
    to: '/demos/playground',
    titleKey: 'demos.cards.playground.title',
    descriptionKey: 'demos.cards.playground.description',
    tagKeys: ['json', 'dynamicScenes'],
  },
  {
    slug: 'textPlayground',
    to: '/demos/text-playground',
    titleKey: 'demos.cards.textPlayground.title',
    descriptionKey: 'demos.cards.textPlayground.description',
    tagKeys: ['typography', 'bindings'],
  },
  {
    slug: 'composite',
    to: '/demos/composite',
    titleKey: 'demos.cards.composite.title',
    descriptionKey: 'demos.cards.composite.description',
    tagKeys: ['renderGroup', 'layers'],
  },
  {
    slug: 'shapes',
    to: '/demos/shapes',
    titleKey: 'demos.cards.shapes.title',
    descriptionKey: 'demos.cards.shapes.description',
    tagKeys: ['shapes', 'primitives'],
  },
  {
    slug: 'hiResDrawing',
    to: '/demos/high-res-drawing',
    titleKey: 'demos.cards.hiResDrawing.title',
    descriptionKey: 'demos.cards.hiResDrawing.description',
    tagKeys: ['drawing', 'export'],
  },
  {
    slug: 'pdfWatermark',
    to: '/demos/pdf-watermark',
    titleKey: 'demos.cards.pdfWatermark.title',
    descriptionKey: 'demos.cards.pdfWatermark.description',
    tagKeys: ['image', 'text', 'bindings'],
  },
]
