import * as fc from 'fast-check'
import { formatTimer, truncateAddress } from './string'

describe('utils/string', () => {
  describe('formatTimer', () => {
    it('formats 1 digit value to 2 digit numeric string', () => {
      fc.assert(
        fc.property(
          fc.integer({
            max: 9,
            min: 0,
          }),
          (value) => {
            const result = formatTimer(value)
            expect(result.length).toBe(2)
            expect(result[0]).toBe('0')
          }
        )
      )
    })

    it('returns the same value when value has more than 1 digit', () => {
      fc.assert(
        fc.property(
          fc.integer({
            min: 10,
          }),
          (value) => {
            const result = formatTimer(value)
            expect(result.length).toBe(String(value).length)
          }
        )
      )
    })
  })

  describe('truncateAddress', () => {
    it('should return truncated address', () => {
      fc.assert(
        fc.property(
          fc.hexaString({ minLength: 42, maxLength: 42 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          (hash, start, end) => {
            const result = truncateAddress(hash, start, end)

            for (let i = 0; i < start; i++) {
              expect(result[i]).toBe(hash[i])
            }
            for (let i = 0; i < end; i++) {
              expect(result[i * -1]).toBe(hash[i * -1])
            }
            expect(result.length).toBe(start + end + 3)
          }
        )
      )
    })
  })
})
