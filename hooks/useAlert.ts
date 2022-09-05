import { useRecoilValue } from 'recoil'
import { useRouter } from 'next/router'

import {
  invalidPriceState,
  metamaskNotFoundState,
  networkMismatchState,
} from 'app/states/error'

export function useAlert() {
  const { pathname } = useRouter()
  const isStakingPage =
    pathname === '/wncg' || pathname.startsWith('/wncg/pool')

  const metamaskNotFound = useRecoilValue(metamaskNotFoundState)
  const networkMismatch = useRecoilValue(networkMismatchState)
  const invalidPrice = useRecoilValue(invalidPriceState)

  const showNetworkAlert = isStakingPage && !metamaskNotFound && networkMismatch
  const showCoingeckoAlert = isStakingPage && !showNetworkAlert && invalidPrice

  const showAlert = showNetworkAlert || showCoingeckoAlert

  return {
    showAlert,
    showNetworkAlert,
    showCoingeckoAlert,
  }
}
