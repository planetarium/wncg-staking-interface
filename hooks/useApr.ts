import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { getTotalStaked } from 'app/states/bpt'
import { poolTokenPriceState } from 'app/states/pool'
import { getBalEmissionPerSec, getWncgEmissionPerSec } from 'app/states/reward'
import Decimal from 'utils/num'
import { useFetchTokenPrices } from './useFetchTokenPrices'
import { useAppSelector } from './useRedux'

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365

export function useApr() {
  const { balPrice, wncgPrice } = useFetchTokenPrices()
  const bptPrice = useRecoilValue(poolTokenPriceState)

  const totalStaked = useAppSelector(getTotalStaked)
  const balEmissionPerSec = useAppSelector(getBalEmissionPerSec)
  const wncgEmissionPerSec = useAppSelector(getWncgEmissionPerSec)

  const totalStakedValue = new Decimal(totalStaked).mul(bptPrice).toNumber()

  const balApr = useMemo(
    () => calculateApr(balEmissionPerSec, balPrice, totalStakedValue),
    [totalStakedValue, balEmissionPerSec, balPrice]
  )

  const wncgApr = useMemo(
    () => calculateApr(wncgEmissionPerSec, wncgPrice, totalStakedValue),
    [totalStakedValue, wncgEmissionPerSec, wncgPrice]
  )

  return {
    balApr,
    wncgApr,
  }
}

export function calculateApr(
  emissionRate: string,
  price: number,
  totalStakedValue: number
) {
  const apr = new Decimal(emissionRate)
    .mul(price)
    .mul(YEAR_IN_SECONDS)
    .div(totalStakedValue)
    .mul(100)

  const validApr = !apr.isNaN() && apr.isFinite()
  return validApr ? apr.toNumber() : 0
}
