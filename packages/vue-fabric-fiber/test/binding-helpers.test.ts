import { describe, expect, it } from 'vitest'
import {
  normalizeKeySelection,
  pickDefinedOptions,
  pickDefinedProps,
  pickFromUnknown,
} from '../lib/binding-helpers'

describe('binding helpers', () => {
  it('normalizes key selections against a whitelist', () => {
    const validKeys = new Set(['width', 'height', 'fill'])
    const result = normalizeKeySelection(
      ['width', 'unknown', 123, 'height', 'width'],
      validKeys,
    )
    expect(result).toEqual(['width', 'height', 'width'])
  })

  it('picks defined props from a typed source', () => {
    const payload = {
      width: 100,
      height: undefined,
      fill: '#000',
    }

    const result = pickDefinedProps(payload, ['width', 'height', 'fill'] as const)
    expect(result).toEqual({
      width: 100,
      fill: '#000',
    })
  })

  it('picks properties from unknown sources safely', () => {
    const payload = {
      width: 42,
      height: 24,
      hidden: true,
    }

    const result = pickFromUnknown(payload, ['height', 'missing'] as const)
    expect(result).toEqual({ height: 24 })
  })

  it('drops undefined values when picking defined options', () => {
    const payload = { selection: true, hoverCursor: undefined }
    expect(pickDefinedOptions(payload, ['selection', 'hoverCursor'] as const)).toEqual({
      selection: true,
    })
    expect(pickDefinedOptions(undefined, ['selection'] as const)).toEqual({})
  })
})
