import { describe, expect, it } from 'vitest'
import * as entry from '../lib'

describe('package entry', () => {
  it('exposes the primary Vue bindings', () => {
    expect(entry.FabricCanvas).toBeDefined()
    expect(entry.RenderGroup).toBeDefined()
    expect(entry.FabricImage).toBeDefined()
    expect(entry.FabricText).toBeDefined()
  })
})
