export const CANVAS_WIDTH = 440
export const CANVAS_HEIGHT = 660
export const PAGE_WIDTH = 420
export const PAGE_HEIGHT = 630
export const WATERMARK_MARGIN = 24

export const pageLeft = (CANVAS_WIDTH - PAGE_WIDTH) / 2
export const pageTop = (CANVAS_HEIGHT - PAGE_HEIGHT) / 2
export const pageBottom = pageTop + PAGE_HEIGHT
export const canvasCenterX = CANVAS_WIDTH / 2
export const watermarkXMax = PAGE_WIDTH - WATERMARK_MARGIN * 2
export const watermarkBottomMax = Math.round(PAGE_HEIGHT * 0.4)
export const placeholderTextContent = '等待上传 PDF 文件'

export const canvasOptions = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  preserveObjectStacking: true,
  backgroundColor: 'transparent',
}
