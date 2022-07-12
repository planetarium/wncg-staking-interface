import * as fc from 'fast-check'
import { sanitizeNumber } from './num'

describe('utils/num', () => {
  describe('sanitizeNumber', () => {
    it('should return 0 when argument is `undefined`', () => {
      const result = sanitizeNumber(undefined)
      expect(result).toBe('0')
    })

    it('should return 0 when argument is `null`', () => {
      const result = sanitizeNumber(null)
      expect(result).toBe('0')
    })

    it('should return 0 when argument is `NaN`', () => {
      const result = sanitizeNumber(NaN)
      expect(result).toBe('0')
    })

    it('should return an empty string when argument is `undefined` and `allowEmptyString` option is true', () => {
      const result = sanitizeNumber(undefined, { allowEmptyString: true })
      expect(result).toBe('')
    })

    it('should return an empty string when argument is `null` and `allowEmptyString` option is true', () => {
      const result = sanitizeNumber(null, { allowEmptyString: true })
      expect(result).toBe('')
    })

    it('should return an empty string when argument is `NaN` and `allowEmptyString` option is true', () => {
      const result = sanitizeNumber(NaN, { allowEmptyString: true })
      expect(result).toBe('')
    })

    it('should not contain comma', () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          const localeValue = value.toLocaleString()
          expect(sanitizeNumber(localeValue)).toBe(String(value))
        })
      )
    })
  })
})
