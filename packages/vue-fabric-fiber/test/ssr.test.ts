/**
 * @vitest-environment node
 */
import * as fabric from 'fabric/node'
import { describe, expect, it } from 'vitest'

describe('ssr', () => {
  it('instantiates a fabric canvas in node environment', () => {
    const canvas = new fabric.Canvas(null, { width: 120, height: 80 })
    expect(canvas.getWidth()).toBe(120)
    expect(canvas.getHeight()).toBe(80)
  })
})
