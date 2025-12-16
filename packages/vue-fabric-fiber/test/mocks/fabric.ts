type EventHandler = (event?: unknown) => void

interface DimensionCall {
  dim: Record<string, number | undefined>
  options?: Record<string, unknown>
}

interface CanvasEventLog {
  event: string
  payload?: unknown
}

class MockFabricObject {
  canvas?: Canvas
  private listeners = new Map<string, Set<EventHandler>>()

  constructor(initial: Record<string, unknown> = {}) {
    Object.assign(this, initial)
  }

  set(props: Record<string, unknown>) {
    Object.assign(this, props)
    return this
  }

  on(event: string, handler: EventHandler) {
    const handlers = this.listeners.get(event) ?? new Set<EventHandler>()
    handlers.add(handler)
    this.listeners.set(event, handlers)
    return () => {
      handlers.delete(handler)
    }
  }

  emit(event: string, payload?: unknown) {
    const handlers = this.listeners.get(event)
    handlers?.forEach(handler => handler(payload))
  }
}

class Canvas {
  static instances: Canvas[] = []
  element?: HTMLCanvasElement
  width: number
  height: number
  enableRetinaScaling = true
  objects: MockFabricObject[] = []
  dimensionCalls: DimensionCall[] = []
  renderCount = 0
  events: CanvasEventLog[] = []
  disposed = false
  calcCalled = false

  constructor(
    element?: HTMLCanvasElement,
    options: Record<string, unknown> = {},
  ) {
    this.element = element
    this.width = (options.width as number | undefined) ?? element?.width ?? 300
    this.height = (options.height as number | undefined) ?? element?.height ?? 150
    Object.assign(this, options)
    Canvas.instances.push(this)
  }

  add(obj: MockFabricObject) {
    this.objects.push(obj)
    obj.canvas = this
    return obj
  }

  remove(obj: MockFabricObject) {
    const index = this.objects.indexOf(obj)
    if (index >= 0) {
      this.objects.splice(index, 1)
    }
    if (obj.canvas === this) {
      obj.canvas = undefined
    }
  }

  getObjects() {
    return [...this.objects]
  }

  getWidth() {
    return this.width
  }

  getHeight() {
    return this.height
  }

  setDimensions(
    dim: Record<string, number | undefined>,
    options?: Record<string, unknown>,
  ) {
    this.dimensionCalls.push({ dim, options })
    if (typeof dim.width === 'number') {
      this.width = dim.width
    }
    if (typeof dim.height === 'number') {
      this.height = dim.height
    }
  }

  moveObjectTo(target: MockFabricObject, position: number) {
    const idx = this.objects.indexOf(target)
    if (idx === -1) {
      return
    }
    this.objects.splice(idx, 1)
    this.objects.splice(position, 0, target)
  }

  requestRenderAll() {
    this.renderCount += 1
  }

  renderAll() {
    this.renderCount += 1
  }

  set(key: string, value: unknown) {
    ;(this as unknown as Record<string, unknown>)[key] = value
  }

  calcOffset() {
    this.calcCalled = true
  }

  fire(event: string, payload?: unknown) {
    this.events.push({ event, payload })
  }

  dispose() {
    this.disposed = true
    this.objects = []
  }
}

class FabricImage extends MockFabricObject {
  static instances: FabricImage[] = []
  static failureSources = new Set<string>()

  src = ''
  crossOrigin: string | null = null
  width = 100
  height = 100
  scaleX = 1
  scaleY = 1
  coordsSet = 0

  constructor(initial: Record<string, unknown> = {}) {
    super(initial)
    Object.assign(this, initial)
    FabricImage.instances.push(this)
  }

  static async fromURL(
    src: string,
    loadOptions: { crossOrigin?: string, signal?: AbortSignal } = {},
    initial: Record<string, unknown> = {},
  ) {
    if (FabricImage.failureSources.has(src)) {
      throw new Error(`Failed to load: ${src}`)
    }
    if (loadOptions?.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError')
    }
    const instance = new FabricImage({ src })
    instance.crossOrigin = loadOptions.crossOrigin ?? null
    instance.set(initial)
    return instance
  }

  getSrc() {
    return this.src
  }

  getCrossOrigin() {
    return this.crossOrigin
  }

  getScaledWidth() {
    const width = typeof this.width === 'number' ? this.width : 0
    const scale = typeof this.scaleX === 'number' ? this.scaleX : 1
    return width * scale
  }

  getScaledHeight() {
    const height = typeof this.height === 'number' ? this.height : 0
    const scale = typeof this.scaleY === 'number' ? this.scaleY : 1
    return height * scale
  }

  setCoords() {
    this.coordsSet += 1
  }
}

class FabricText extends MockFabricObject {
  text: string

  constructor(text: string, initial: Record<string, unknown> = {}) {
    super(initial)
    this.text = text
  }
}

class Shadow {
  options: Record<string, unknown>

  constructor(options: Record<string, unknown>) {
    this.options = options
  }
}

class Circle extends MockFabricObject {}
class Ellipse extends MockFabricObject {}
class Polygon extends MockFabricObject {}
class Polyline extends MockFabricObject {}
class Rect extends MockFabricObject {}
class Triangle extends MockFabricObject {}

class Line extends MockFabricObject {
  constructor(points: number[], initial: Record<string, unknown> = {}) {
    super({ ...initial, points })
  }
}

class Path extends MockFabricObject {
  constructor(path: string | unknown[], initial: Record<string, unknown> = {}) {
    super({ ...initial, path })
  }
}

export interface FabricMock {
  module: Record<string, unknown>
  reset: () => void
  Canvas: typeof Canvas
  FabricImage: typeof FabricImage
  FabricText: typeof FabricText
  Object: typeof MockFabricObject
  FabricObject: typeof MockFabricObject
  Circle: typeof Circle
  Ellipse: typeof Ellipse
  Line: typeof Line
  Path: typeof Path
  Polygon: typeof Polygon
  Polyline: typeof Polyline
  Rect: typeof Rect
  Triangle: typeof Triangle
}

export function createFabricMock(): FabricMock {
  const module = {
    Canvas,
    FabricImage,
    FabricText,
    Circle,
    Ellipse,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Triangle,
    Shadow,
    Object: MockFabricObject,
    FabricObject: MockFabricObject,
  }

  return {
    module,
    reset() {
      Canvas.instances.length = 0
      FabricImage.instances.length = 0
      FabricImage.failureSources.clear()
    },
    Canvas,
    FabricImage,
    FabricText,
    Object: MockFabricObject,
    FabricObject: MockFabricObject,
    Circle,
    Ellipse,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Triangle,
  }
}

export type FabricMockModule = ReturnType<typeof createFabricMock>
