import { useCallback } from 'react'

import { getTokenInfo } from 'utils/token'

export function useImportToken() {
  const importToken = useCallback(async (address: string) => {
    if (typeof window === 'undefined' || !window?.ethereum) return

    const tokenInfo = getTokenInfo(address)
    const options = Object.fromEntries(
      Object.entries(tokenInfo).filter(([key]) => key !== 'name')
    )

    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options,
      },
    })
  }, [])

  return {
    importToken,
  }
}
