import type { Canvas, FabricObject } from 'fabric'

interface CanvasObjectEvent {
  target?: FabricObject | null
}

function clampObjectWithinCanvas(canvas: Canvas, target: FabricObject) {
  const width = canvas.getWidth()
  const height = canvas.getHeight()

  if (!width || !height) {
    return
  }

  target.setCoords()
  const bounds = target.getBoundingRect(true, true)
  if (!bounds) {
    return
  }

  let deltaX = 0
  let deltaY = 0

  if (bounds.left < 0) {
    deltaX = -bounds.left
  }
  else if (bounds.left + bounds.width > width) {
    deltaX = width - (bounds.left + bounds.width)
  }

  if (bounds.top < 0) {
    deltaY = -bounds.top
  }
  else if (bounds.top + bounds.height > height) {
    deltaY = height - (bounds.top + bounds.height)
  }

  if (!deltaX && !deltaY) {
    return
  }

  const nextLeft = (target.left ?? 0) + deltaX
  const nextTop = (target.top ?? 0) + deltaY

  target.set({
    left: nextLeft,
    top: nextTop,
  })
  target.setCoords()
  canvas.requestRenderAll()
}

export function bindCanvasDragBounds(canvas: Canvas) {
  const handleObjectMoving = (event: CanvasObjectEvent) => {
    if (!event?.target) {
      return
    }

    clampObjectWithinCanvas(canvas, event.target)
  }

  canvas.on('object:moving', handleObjectMoving)

  return () => {
    canvas.off('object:moving', handleObjectMoving)
  }
}
