export const PAGE_WIDTH = 420
export const PAGE_HEIGHT = 630
export const CANVAS_WIDTH = PAGE_WIDTH
export const CANVAS_HEIGHT = PAGE_HEIGHT
export const WATERMARK_MARGIN = 24

export const pageLeft = 0
export const pageTop = 0
export const pageBottom = PAGE_HEIGHT
export const canvasCenterX = PAGE_WIDTH / 2
export const watermarkXMax = PAGE_WIDTH - WATERMARK_MARGIN * 2
export const watermarkBottomMax = Math.round(PAGE_HEIGHT * 0.4)
export const placeholderTextContent = '等待上传 PDF 文件'

export const canvasOptions = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  preserveObjectStacking: true,
  backgroundColor: 'transparent',
}
