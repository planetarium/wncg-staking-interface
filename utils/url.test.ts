import { getEtherscanUrl, getTxUrl } from './url'
import * as env from './env'

const ADDRESS = '0x434001F88E213e8112454732797b5b1f0774AA73'
const TX_HASH =
  '0x0c622d3c047a105a085216caf012344c3f24d2fbd2d147fee5b5f8269a06d9fb'

jest.mock('./env', () => ({
  __esModule: true,
  IS_ETHEREUM: null,
}))
const mockEnv = env as { IS_ETHEREUM: boolean }

describe('utils/url', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  describe('getEtherscanUrl', () => {
    it('should return an empty string', () => {
      const result = getEtherscanUrl()
      expect(result).toBe('')
    })

    it('should return a valid etherscan link (Ethereum)', () => {
      mockEnv.IS_ETHEREUM = true
      const result = getEtherscanUrl(ADDRESS)
      expect(result).toBe(`https://etherscan.io/address/${ADDRESS}`)
    })

    it('should return a valid etherscan link (Kovan)', () => {
      mockEnv.IS_ETHEREUM = false
      const result = getEtherscanUrl(ADDRESS)
      expect(result).toBe(`https://kovan.etherscan.io/address/${ADDRESS}`)
    })
  })

  describe('getTxUrl', () => {
    it('should return an empty string', () => {
      const result = getTxUrl()
      expect(result).toBe('')
    })

    it('should return a valid etherscan tx link (Ethereum)', () => {
      mockEnv.IS_ETHEREUM = true
      const result = getTxUrl(TX_HASH)
      expect(result).toBe(`https://etherscan.io/tx/${TX_HASH}`)
    })

    it('should return a valid etherscan tx link (Kovan)', () => {
      mockEnv.IS_ETHEREUM = false
      const result = getTxUrl(TX_HASH)
      expect(result).toBe(`https://kovan.etherscan.io/tx/${TX_HASH}`)
    })
  })
})
