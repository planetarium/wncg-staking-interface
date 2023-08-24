import { useCallback, useMemo, useState } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/system'
import { PancakeRouterAbi } from 'config/abi'
import { WRITE_OPTIONS } from 'config/misc'
import { bnum } from 'utils/bnum'
import { calcSlippageAmount } from 'utils/calcSlippageAmount'
import { parseUnits } from 'utils/parseUnits'
import { useAuth, useChain, useStaking } from 'hooks'

export function useRemoveLiquidity(
  amountsOut: string[],
  lpAmountOut: string,
  isNative: boolean,
  signature?: Signature
) {
  const [error, setError] = useState<string | null>(null)

  const { account, isConnected } = useAuth()
  const { chainId, dexProtocolAddress, networkMismatch } = useChain()
  const {
    lpToken,
    poolTokenAddresses,
    poolTokenDecimals,
    shouldReversePoolTokenOrderOnDisplay,
  } = useStaking()

  const ethIndex = shouldReversePoolTokenOrderOnDisplay ? 0 : 1
  const tokenIndex = 1 - ethIndex

  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  const scaledLpAmountOut = parseUnits(
    lpAmountOut,
    lpToken?.decimals
  ).toString()

  const scaledMinAmountsOut = useMemo(
    () =>
      amountsOut.map(
        (amt, i) =>
          calcSlippageAmount(
            parseUnits(amt, poolTokenDecimals[i]).toString(),
            slippage
          )[0]
      ),
    [amountsOut, poolTokenDecimals, slippage]
  )

  const functionName = isNative
    ? 'removeLiquidityETHWithPermit'
    : 'removeLiquidityWithPermit'

  const args = isNative
    ? [
        poolTokenAddresses[tokenIndex],
        scaledLpAmountOut,
        scaledMinAmountsOut[tokenIndex].toString(),
        scaledMinAmountsOut[ethIndex].toString(),
        account,
        signature?.deadline,
        false,
        signature?.v,
        signature?.r,
        signature?.s,
      ]
    : [
        ...poolTokenAddresses,
        scaledLpAmountOut,
        ...scaledMinAmountsOut,
        account,
        signature?.deadline,
        false,
        signature?.v,
        signature?.r,
        signature?.s,
      ]

  console.log(11111, args)

  const enabled =
    !networkMismatch && !!isConnected && bnum(lpAmountOut).gt(0) && !!signature

  const { config } = usePrepareContractWrite({
    address: dexProtocolAddress,
    abi: PancakeRouterAbi as any,
    args,
    chainId,
    functionName,
    enabled,
    onError(err: any) {
      console.log(Object.keys(err))
    },
  })

  const { writeAsync } = useContractWrite(config)

  const removeLiquidity = useCallback(async () => {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }, [writeAsync])

  return writeAsync ? removeLiquidity : undefined
}
