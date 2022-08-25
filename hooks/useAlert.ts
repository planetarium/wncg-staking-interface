import { useRecoilValue } from 'recoil'
import { useRouter } from 'next/router'

import { invalidPriceState } from 'app/states/error'
import { metamaskNotFoundState, networkMismatchState } from 'app/states/network'

export function useAlert() {
  const { pathname } = useRouter()
  const isStakingPage =
    pathname === '/wncg' || pathname.startsWith('/wncg/pool')

  const networkMismatch = useRecoilValue(networkMismatchState)
  const metamaskNotFound = useRecoilValue(metamaskNotFoundState)
  const invalidPrice = useRecoilValue(invalidPriceState)

  const showNetworkAlert = isStakingPage && metamaskNotFound && !networkMismatch
  const showCoingeckoAlert = isStakingPage && !showNetworkAlert && invalidPrice

  const showAlert = showNetworkAlert || showCoingeckoAlert

  return {
    showAlert,
    showNetworkAlert,
    showCoingeckoAlert,
  }
}
