import { useMemo } from 'react'
import { WeightedPoolEncoder } from '@balancer-labs/sdk'

import config from 'config'
import { parseUnits } from 'utils/parseUnits'
import { useCalculator, useSlippage, useStaking } from 'hooks'

type UseJoinBuildRequestParams = {
  assets: Hash[]
  amounts: string[]
  joinInit?: boolean
}

export function useJoinBuildRequest({
  assets,
  amounts,
  joinInit,
}: UseJoinBuildRequestParams) {
  const calculator = useCalculator('join')
  const { minusSlippageScaled } = useSlippage()
  const { tokenMap } = useStaking()

  const joinTokenAddresses = useMemo(
    () =>
      assets.map((addr) => {
        if (addr !== config.nativeCurrency.address) return addr
        return config.zeroAddress
      }),
    [assets]
  )

  const maxAmountsIn = useMemo(
    () =>
      amounts.map((amt, i) => {
        const token = tokenMap[assets[i]]
        return parseUnits(amt, token?.decimals ?? 18).toString()
      }),
    [amounts, assets, tokenMap]
  )

  const minBptOut = useMemo(() => {
    const minBpt = calculator?.exactTokensInForBptOut(amounts).toString() ?? '0'
    return minusSlippageScaled(minBpt)
  }, [amounts, calculator, minusSlippageScaled])

  const request = useMemo(() => {
    const userData = joinInit
      ? WeightedPoolEncoder.joinInit(maxAmountsIn)
      : WeightedPoolEncoder.joinExactTokensInForBPTOut(maxAmountsIn, minBptOut)

    return {
      assets: joinTokenAddresses,
      maxAmountsIn,
      userData,
      fromInternalBalance: false,
    }
  }, [joinInit, joinTokenAddresses, maxAmountsIn, minBptOut])

  return request
}
