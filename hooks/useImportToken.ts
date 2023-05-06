import { useCallback, useMemo } from 'react'
import { useAuth } from './useAuth'
import { ConnectorId } from 'config/constants'

export function useImportToken() {
  const { connector } = useAuth()

  const canImportToken = useMemo(() => {
    if (typeof window === 'undefined') return false

    switch (true) {
      case window?.ethereum?.isMetaMask &&
        connector?.id === ConnectorId.MetaMask:
      case window?.ethereum?.isTrust &&
        connector?.id === ConnectorId.TrustWallet:
      case window?.ethereum?.isCoinbaseWallet &&
        connector?.id === ConnectorId.CoinbaseWallet:
        return true
      default:
        return false
    }
  }, [connector?.id])

  const importToken = useCallback(
    async (options: TokenInfo) => {
      if (!canImportToken) return

      try {
        await (window.ethereum as Ethereum).request({
          method: 'wallet_watchAsset' as any,
          params: {
            type: 'ERC20',
            options,
          } as any,
        })
      } catch (error) {
        console.log(error)
      }
    },
    [canImportToken]
  )

  return {
    importToken,
    canImportToken,
  }
}
