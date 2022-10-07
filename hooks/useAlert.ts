import { useRouter } from 'next/router'

import { networkChainId } from 'utils/network'
import { useNetwork, usePrices } from 'hooks'

export function useAlert() {
  const { chain } = useNetwork()
  const { invalidPriceError } = usePrices()
  const { pathname } = useRouter()

  const isStakingPage =
    pathname === '/wncg' || pathname.startsWith('/wncg/pool')

  const ethereumNotDetected = typeof window !== 'undefined' && !window.ethereum
  const networkMismatch = chain && chain.id !== networkChainId

  const showNetworkAlert =
    isStakingPage && !ethereumNotDetected && networkMismatch
  const showCoingeckoAlert =
    isStakingPage && !showNetworkAlert && invalidPriceError
  const showAlert = showNetworkAlert || showCoingeckoAlert

  return {
    showAlert,
    showNetworkAlert,
    showCoingeckoAlert,
  }
}
