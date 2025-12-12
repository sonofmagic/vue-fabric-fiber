export interface WatermarkAxis {
  px: number
  percent: number
}

export type WatermarkOrigin = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface WatermarkField {
  id: 'sku' | 'order'
  label: string
  text: string
  color: string
  x: WatermarkAxis
  y: WatermarkAxis
  opacity: number
  fontSize: number
}
