import { useMemo } from 'react'
import { WeightedPoolEncoder } from '@balancer-labs/sdk'

import config from 'config'
import { bnum } from 'utils/bnum'
import { parseUnits } from 'utils/parseUnits'
import { safeBigNumber } from 'utils/safeBigNumber'
import { useExitMath, useStaking } from 'hooks'

type UseExitPoolRequestParams = {
  assets: Hash[]
  amounts: string[]
  exitType: Hash | null
  exactOut: boolean
  bptOutPcnt: string
}

export function useExitBuildRequest({
  assets: _assets,
  amounts,
  exactOut,
  exitType,
  bptOutPcnt,
}: UseExitPoolRequestParams) {
  const { poolTokenAddresses, tokenMap } = useStaking()
  const { calcBptIn } = useExitMath()

  const isProportional = exitType === null

  const assets = useMemo(
    () =>
      _assets.map((addr) => {
        if (addr !== config.nativeCurrency.address) return addr
        return config.zeroAddress
      }),
    [_assets]
  )

  const singleExitTokenOutIndex = useMemo(() => {
    if (isProportional) return -1

    switch (true) {
      case exitType === config.nativeCurrency.address:
        return poolTokenAddresses.indexOf(config.weth)
      case poolTokenAddresses.includes(exitType):
        return poolTokenAddresses.indexOf(exitType)
      default:
        return -1
    }
  }, [exitType, isProportional, poolTokenAddresses])

  const bptIn = useMemo(() => {
    return calcBptIn({
      exactOut,
      isProportional: exitType === null,
      tokenOutIndex: singleExitTokenOutIndex,
      tokenOutAmount: amounts[singleExitTokenOutIndex],
      bptOutPcnt,
    })
  }, [
    calcBptIn,
    exactOut,
    exitType,
    singleExitTokenOutIndex,
    amounts,
    bptOutPcnt,
  ])

  const minAmountsOut = useMemo(() => {
    if (isProportional) return ['0', '0']
    return amounts.map((a, i) => {
      const token = tokenMap[_assets[i]]
      return safeBigNumber(parseUnits(a, token?.decimals ?? 18).toString())
    })
  }, [_assets, amounts, isProportional, tokenMap])

  const userData = useMemo(() => {
    switch (true) {
      case isProportional:
        return WeightedPoolEncoder.exitExactBPTInForTokensOut(bptIn)

      case exactOut:
        return WeightedPoolEncoder.exitBPTInForExactTokensOut(
          minAmountsOut,
          bptIn
        )

      default:
        const tokenOutIndex = minAmountsOut.findIndex((amt) => bnum(amt).gt(0))

        if (tokenOutIndex < 0) return {}

        return WeightedPoolEncoder.exitExactBPTInForOneTokenOut(
          bptIn,
          tokenOutIndex
        )
    }
  }, [bptIn, exactOut, isProportional, minAmountsOut])

  return {
    assets,
    minAmountsOut,
    userData,
    fromInternalBalance: false,
  }
}
