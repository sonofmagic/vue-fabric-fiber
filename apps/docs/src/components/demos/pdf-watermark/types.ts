export type WatermarkPositionUnit = 'px' | '%'

export interface WatermarkAxis {
  px: number
  percent: number
  unit: WatermarkPositionUnit
}

export interface WatermarkField {
  id: 'sku' | 'order'
  label: string
  text: string
  color: string
  x: WatermarkAxis
  bottom: WatermarkAxis
  opacity: number
  fontSize: number
}
