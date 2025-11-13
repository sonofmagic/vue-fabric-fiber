import { describe, expect, it } from 'vitest'
import { removeUndefined } from '../lib/utils'

describe('removeUndefined', () => {
  it('removes undefined entries from objects recursively', () => {
    const payload = {
      width: 320,
      height: undefined,
      meta: {
        label: 'canvas',
        color: undefined,
      },
    }

    const sanitized = removeUndefined(payload)
    expect(sanitized).toEqual({
      width: 320,
      meta: { label: 'canvas' },
    })
  })

  it('keeps falsy values other than undefined', () => {
    const payload = {
      zero: 0,
      empty: '',
      validFalse: false,
      skipMe: undefined,
    }
    expect(removeUndefined(payload)).toEqual({
      zero: 0,
      empty: '',
      validFalse: false,
    })
  })

  it('filters undefined values in arrays without touching order', () => {
    const payload = ['keep', undefined, 'also-keep', undefined]
    expect(removeUndefined(payload)).toEqual(['keep', 'also-keep'])
  })
})
