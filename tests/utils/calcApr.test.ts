import { describe, expect, it } from 'vitest'
import { calcApr } from 'utils/calcApr'

describe('calcApr', () => {
  it('should calculate Apr', () => {
    const emissionPerSec = '1'
    const tokenPrice = '12'
    const totalStakedValue = 10

    const apr = calcApr(emissionPerSec, tokenPrice, totalStakedValue)

    expect(apr).toBe('3784320000')
  })
})
