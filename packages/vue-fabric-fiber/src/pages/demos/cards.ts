export interface DemoCard {
  to: string
  title: string
  description: string
  tags?: string[]
}

export const demoCards: DemoCard[] = [
  {
    to: '/demos/basic',
    title: 'Basic Hero Banner',
    description: 'Layer text on top of asynchronous imagery and tweak layout controls in real time.',
    tags: ['Text', 'Image', 'Reactive'],
  },
  {
    to: '/demos/animating-crosses',
    title: 'Animating Crosses',
    description: 'Recreate Fabric’s classic cross animation with component-driven objects and palette controls.',
    tags: ['Animation', 'Custom Object'],
  },
  {
    to: '/demos/playground',
    title: 'Code Playground',
    description: 'Edit scene blueprints and instantly render Fabric components from JSON-driven instructions.',
    tags: ['JSON', 'Dynamic Scenes'],
  },
  {
    to: '/demos/text-playground',
    title: 'Interactive Typography',
    description: 'Directly bind fabric text props to form inputs and keep canvas edits in sync.',
    tags: ['Typography', 'Bindings'],
  },
  {
    to: '/demos/composite',
    title: 'Layered Composition',
    description: 'Combine RenderGroup queues to orchestrate complex scenes with toggled layers.',
    tags: ['RenderGroup', 'Layers'],
  },
  {
    to: '/demos/shapes',
    title: 'Shape Toolkit',
    description: 'Rectangles, polylines, paths, and more using the Fabric shape components.',
    tags: ['Shapes', 'Primitives'],
  },
]
