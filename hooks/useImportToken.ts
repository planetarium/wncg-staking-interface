import { useCallback } from 'react'

export function useImportToken() {
  const importToken = useCallback(async (address: string) => {
    if (typeof window === 'undefined' || !window?.ethereum) return

    // FIXME: will going to fix it in next pr
    // const tokenInfo = getTokenInfo(address)
    // const options = Object.fromEntries(
    //   Object.entries(tokenInfo).filter(([key]) => key !== 'name')
    // )

    // await window.ethereum.request({
    //   method: 'wallet_watchAsset',
    //   params: {
    //     type: 'ERC20',
    //     options,
    //   },
    // })
  }, [])

  return {
    importToken,
  }
}
