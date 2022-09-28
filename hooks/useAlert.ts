import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { useNetwork } from 'wagmi'

import { invalidPriceState } from 'app/states/error'
import { networkChainId } from 'utils/network'

export function useAlert() {
  const { chain } = useNetwork()
  const { pathname } = useRouter()
  const isStakingPage =
    pathname === '/wncg' || pathname.startsWith('/wncg/pool')

  const ethereumNotDetected = typeof window !== 'undefined' && !window.ethereum
  const networkMismatch = chain && chain.id !== networkChainId
  const invalidPrice = useRecoilValue(invalidPriceState)

  const showNetworkAlert =
    isStakingPage && !ethereumNotDetected && networkMismatch
  const showCoingeckoAlert = isStakingPage && !showNetworkAlert && invalidPrice
  const showAlert = showNetworkAlert || showCoingeckoAlert

  return {
    showAlert,
    showNetworkAlert,
    showCoingeckoAlert,
  }
}
