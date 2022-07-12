import { useMemo } from 'react'

import { getTotalStakedValue } from 'app/states/bpt'
import { getBalEmissionPerSec, getWncgEmissionPerSec } from 'app/states/reward'
import { getBalPrice, getWncgPrice } from 'app/states/token'
import Decimal from 'utils/num'
import { useAppSelector } from './useRedux'

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365

export function useApr() {
  const totalStakedValue = useAppSelector(getTotalStakedValue)
  const balEmissionPerSec = useAppSelector(getBalEmissionPerSec)
  const balPrice = useAppSelector(getBalPrice)
  const wncgEmissionPerSec = useAppSelector(getWncgEmissionPerSec)
  const wncgPrice = useAppSelector(getWncgPrice)

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
  price: string | number,
  totalStakedValue: string | number
) {
  const apr = new Decimal(emissionRate)
    .mul(price)
    .mul(YEAR_IN_SECONDS)
    .div(totalStakedValue)
    .mul(100)

  const validApr = !apr.isNaN() && apr.isFinite()
  return validApr ? apr.toNumber() : 0
}
