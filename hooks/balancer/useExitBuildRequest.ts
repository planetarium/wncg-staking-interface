import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSameAddress } from '@balancer-labs/sdk'
import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/system'
import {
  NATIVE_CURRENCY_ADDRESS,
  ZERO_ADDRESS,
} from 'config/constants/addresses'
import { calcSlippageBsp } from 'utils/calcSlippageBsp'
import { useChain, useStaking } from 'hooks'
import { useBalancerSdk } from './useBalancerSdk'
import { useExitMath } from './useExitMath'

type UseExitPoolRequestParams = {
  account: Hash | null
  assets: Hash[]
  amounts: string[]
  exitType: Hash | null
  isExactOut: boolean
  bptOutPcnt: string
}

export function useExitBuildRequest({
  account,
  assets: _assets,
  amounts,
  isExactOut,
  exitType,
  bptOutPcnt,
}: UseExitPoolRequestParams) {
  const [exitPoolRequest, setExitPoolRequest] =
    useState<ExitExactBPTInAttributes | null>(null)

  const { sdkPool } = useBalancerSdk()
  const { nativeCurrency } = useChain()
  const { calcBptIn } = useExitMath()
  const { poolTokenAddresses } = useStaking()

  const slippage = useAtomValue(slippageAtom) ?? '0.5'
  const slippageBsp = calcSlippageBsp(slippage)

  const isPropExit = exitType === null

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

  const updateUserData = useCallback(() => {
    if (!sdkPool || !account) return

    const singleTokenMaxOutAddress = isPropExit
      ? undefined
      : exitType === NATIVE_CURRENCY_ADDRESS
      ? ZERO_ADDRESS
      : exitType

    const shouldUnwrapNativeAsset =
      !!exitType && isSameAddress(exitType, NATIVE_CURRENCY_ADDRESS)

    try {
      const data = sdkPool.buildExitExactBPTIn(
        account!,
        bptIn!,
        slippageBsp,
        shouldUnwrapNativeAsset,
        singleTokenMaxOutAddress?.toLowerCase()
      ) as ExitExactBPTInAttributes

      setExitPoolRequest(data)
    } catch (error) {
      throw error
    }
  }, [account, bptIn, exitType, isPropExit, sdkPool, slippageBsp])

  useEffect(() => {
    updateUserData()
  }, [updateUserData])

  if (!exitPoolRequest) return null

  return exitPoolRequest?.attributes?.exitPoolRequest
}
