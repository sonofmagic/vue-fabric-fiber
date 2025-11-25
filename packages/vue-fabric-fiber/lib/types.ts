import type * as fabric from 'fabric'
import type PQueue from 'p-queue'

export type SequentialTask = () => Promise<void> | void

export interface AddSequentialTaskOptions {
  priority?: number
  /**
   * When true the task executes immediately instead of entering the queue.
   */
  bypassQueue?: boolean
}

export interface Context {
  canvasEl?: HTMLCanvasElement
  fabricCanvas?: fabric.Canvas
  containerEl?: HTMLDivElement
  addObject: (obj: fabric.Object, priority?: number) => void
  removeObject: (obj: fabric.Object) => void
  taskQueue: PQueue
  addSequentialTask: (task: SequentialTask, options?: AddSequentialTaskOptions) => Promise<unknown>
}
