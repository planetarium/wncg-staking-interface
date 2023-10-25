import { calcApr } from 'utils/calcApr'
import { TextEncoder } from 'util'

global.TextEncoder = TextEncoder

describe('calcApr', () => {
  it('should calculate Apr', () => {
    const emissionPerSec = '1'
    const tokenPrice = '12'
    const totalStakedValue = 10

    const apr = calcApr(emissionPerSec, tokenPrice, totalStakedValue)

    expect(apr).toBe('3784320000')
  })
})
