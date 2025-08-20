import type * as fabric from 'fabric'
import type PQueue from 'p-queue'

export interface Context {
  canvasEl?: HTMLCanvasElement
  fabricCanvas?: fabric.Canvas
  containerEl?: HTMLDivElement
  addObject: (obj: fabric.Object) => void
  removeObject: (obj: fabric.Object) => void
  taskQueue: PQueue
  addSequentialTask: (task: () => Promise<void> | void) => void
}
