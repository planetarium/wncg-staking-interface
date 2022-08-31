import { useRecoilValue } from 'recoil'
import { useRouter } from 'next/router'

import { invalidPriceState, networkMismatchState } from 'app/states/error'
import { useProvider } from './useProvider'

export function useAlert() {
  const { pathname } = useRouter()
  const provider = useProvider()
  const isStakingPage =
    pathname === '/wncg' || pathname.startsWith('/wncg/pool')

  const metamaskNotFound = provider == null
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
