import { useMemo } from 'react'
import { WeightedPoolEncoder } from '@balancer-labs/sdk'

import {
  NATIVE_CURRENCY_ADDRESS,
  ZERO_ADDRESS,
} from 'config/constants/addresses'
import { bnum } from 'utils/bnum'
import { parseUnits } from 'utils/parseUnits'
import { safeBigNumber } from 'utils/safeBigNumber'
import { useChain, useStaking } from 'hooks'
import { useExitMath } from './useExitMath'

type UseExitPoolRequestParams = {
  assets: Hash[]
  amounts: string[]
  exitType: Hash | null
  isExactOut: boolean
  bptOutPcnt: string
}

export function useExitBuildRequest({
  assets: _assets,
  amounts,
  isExactOut,
  exitType,
  bptOutPcnt,
}: UseExitPoolRequestParams) {
  const { nativeCurrency } = useChain()
  const { calcBptIn } = useExitMath()
  const { poolTokenAddresses, tokens } = useStaking()

  const isPropExit = exitType === null

  const assets = useMemo(
    () =>
      _assets.map((addr) => {
        if (addr !== NATIVE_CURRENCY_ADDRESS) return addr
        return ZERO_ADDRESS
      }),
    [_assets]
  )

  const singleExitTokenOutIndex = useMemo(() => {
    if (isPropExit) return -1

    switch (true) {
      case exitType === nativeCurrency.address:
        return poolTokenAddresses.indexOf(nativeCurrency.wrappedTokenAddress)
      case poolTokenAddresses.includes(exitType):
        return poolTokenAddresses.indexOf(exitType)
      default:
        return -1
    }
  }, [
    exitType,
    isPropExit,
    nativeCurrency.address,
    nativeCurrency.wrappedTokenAddress,
    poolTokenAddresses,
  ])

  const bptIn = useMemo(() => {
    return calcBptIn({
      isExactOut,
      isPropExit: exitType === null,
      tokenOutIndex: singleExitTokenOutIndex,
      tokenOutAmount: amounts[singleExitTokenOutIndex],
      bptOutPcnt,
    })
  }, [
    calcBptIn,
    isExactOut,
    exitType,
    singleExitTokenOutIndex,
    amounts,
    bptOutPcnt,
  ])

  const minAmountsOut = useMemo(() => {
    if (isPropExit) return ['0', '0']
    return amounts.map((a, i) =>
      safeBigNumber(
        parseUnits(a, tokens[_assets[i]]?.decimals ?? 18).toString()
      )
    )
  }, [_assets, amounts, isPropExit, tokens])

  const userData = useMemo(() => {
    switch (true) {
      case isPropExit:
        return WeightedPoolEncoder.exitExactBPTInForTokensOut(bptIn)

      case isExactOut:
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
  }, [bptIn, isExactOut, isPropExit, minAmountsOut])

  return {
    assets,
    minAmountsOut,
    userData,
    fromInternalBalance: false,
  }
}
