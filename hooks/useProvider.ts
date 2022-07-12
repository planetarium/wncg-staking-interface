import { useMemo } from 'react'
import { providers } from 'ethers'

export function useProvider() {
  const provider = useMemo(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null
    }

    return new providers.Web3Provider(
      window.ethereum as any as providers.ExternalProvider,
      'any'
    )
  }, [])

  return provider
}
