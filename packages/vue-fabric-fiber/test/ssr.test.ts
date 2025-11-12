/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest'

let fabricModule: typeof import('fabric/node') | null = null

try {
  fabricModule = await import('fabric/node')
}
catch (error) {
  console.warn(
    '[ssr.test] Skipping fabric SSR test because native bindings are unavailable.',
    error,
  )
}

const describeIfFabricAvailable = fabricModule ? describe : describe.skip

describeIfFabricAvailable('ssr', () => {
  it('instantiates a fabric canvas in node environment', () => {
    if (!fabricModule) {
      throw new Error('fabric/node is unavailable; test should have been skipped')
    }

    const canvas = new fabricModule.Canvas(null, { width: 120, height: 80 })
    expect(canvas.getWidth()).toBe(120)
    expect(canvas.getHeight()).toBe(80)
  })
})
