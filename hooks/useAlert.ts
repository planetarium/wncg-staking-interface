import { useRecoilValue } from 'recoil'
import { useRouter } from 'next/router'

import {
  getIsMetamaskInstalled,
  getIsValidNetwork,
} from 'app/states/connection'
import { priceErrorState } from 'app/states/error'
import { useAppSelector } from './useRedux'

export function useAlert() {
  const { pathname } = useRouter()
  const isStakingPage =
    pathname === '/wncg' || pathname.startsWith('/wncg/pool')

  const isPriceInvalid = useRecoilValue(priceErrorState)
  const isMetamaskInstalled = useAppSelector(getIsMetamaskInstalled)
  const isValidNetwork = useAppSelector(getIsValidNetwork)

  const showNetworkAlert =
    isStakingPage && isMetamaskInstalled && !isValidNetwork
  const showCoingeckoAlert =
    isStakingPage && !showNetworkAlert && isPriceInvalid

  const showAlert = showNetworkAlert || showCoingeckoAlert

  return {
    showAlert,
    showNetworkAlert,
    showCoingeckoAlert,
  }
}
