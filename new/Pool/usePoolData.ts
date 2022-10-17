import { useMemo } from 'react'

import { bnum } from 'utils/num'
import { getTokenColor } from 'utils/token'
import { usePool } from 'hooks'

export function usePoolData() {
  const {
    poolTokenAddresses: _poolTokenAddresses,
    poolTokenBalances: _poolTokenBalances,
    poolTokenDecimals: _poolTokenDecimals,
    poolTokenSymbols: _poolTokenSymbols,
    poolTokenWeights: _poolTokenWeights,
    poolSwapFee,
    poolTotalLiquidity,
    poolTotalSwapFee,
    poolTotalSwapVolume,
    ercTokenIndex,
    nativeAssetIndex,
  } = usePool()

  const shouldReverseOrder = useMemo(
    () => ercTokenIndex > nativeAssetIndex,
    [ercTokenIndex, nativeAssetIndex]
  )

  const poolTokenAddresses = useMemo(
    () =>
      shouldReverseOrder ? _poolTokenAddresses.reverse() : _poolTokenAddresses,
    [_poolTokenAddresses, shouldReverseOrder]
  )

  const poolTokenBalances = useMemo(
    () =>
      shouldReverseOrder ? _poolTokenBalances.reverse() : _poolTokenBalances,
    [_poolTokenBalances, shouldReverseOrder]
  )

  const poolTokenColors = useMemo(
    () => poolTokenAddresses.map((address) => getTokenColor(address)),
    [poolTokenAddresses]
  )

  const poolTokenDecimals = useMemo(
    () =>
      shouldReverseOrder ? _poolTokenDecimals.reverse() : _poolTokenDecimals,
    [_poolTokenDecimals, shouldReverseOrder]
  )

  const poolTokenSymbols = useMemo(
    () =>
      shouldReverseOrder ? _poolTokenSymbols.reverse() : _poolTokenSymbols,
    [_poolTokenSymbols, shouldReverseOrder]
  )

  const poolTokenWeights = useMemo(
    () =>
      shouldReverseOrder ? _poolTokenWeights.reverse() : _poolTokenWeights,
    [_poolTokenWeights, shouldReverseOrder]
  )

  const poolTokenWeightsInPcnt = useMemo(
    () => poolTokenWeights.map((weight) => bnum(weight).times(100).toNumber()),
    [poolTokenWeights]
  )

  const poolName = useMemo(
    () => poolTokenSymbols.join(' - ') || 'Balancer Weighted Pool',
    [poolTokenSymbols]
  )

  return {
    poolName,
    poolSwapFee,
    poolTokenAddresses,
    poolTokenBalances,
    poolTokenColors,
    poolTokenDecimals,
    poolTokenSymbols,
    poolTokenWeights,
    poolTokenWeightsInPcnt,
    poolTotalLiquidity,
    poolTotalSwapFee,
    poolTotalSwapVolume,
  }
}
