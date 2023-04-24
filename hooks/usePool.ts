import { useMemo } from 'react'
import { useFetchPoolSnapshot } from './queries'
import { useFiat } from './useFiat'
import { useStaking } from './useStaking'
import { bnum } from 'utils/bnum'

export function usePool() {
  const toFiat = useFiat()
  const { poolTokenAddresses, poolTokenBalances: initPoolTokenBalances } =
    useStaking()

  const {
    poolTokenBalances = initPoolTokenBalances,
    totalSwapVolumeIn24Hr = '0',
    totalSwapFeesIn24Hr = '0',
  } = useFetchPoolSnapshot().data ?? {}

  const poolValueIn24Hr = useMemo(
    () =>
      poolTokenBalances
        .reduce((acc, b, i) => {
          return acc.plus(toFiat(b, poolTokenAddresses[i]))
        }, bnum(0))
        .toString(),
    [poolTokenAddresses, poolTokenBalances, toFiat]
  )

  return {
    poolTokenBalances,
    poolValueIn24Hr,
    totalSwapVolumeIn24Hr,
    totalSwapFeesIn24Hr,
  }
}
