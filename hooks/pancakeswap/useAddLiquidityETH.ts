import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { slippageAtom } from 'states/system'
import { PancakeRouterAbi } from 'config/abi'
import { DEX_PROTOCOL_ADDRESS } from 'config/constants/addresses'
import { MINUTE } from 'config/misc'
import { calcSlippageAmount } from 'utils/calcSlippageAmount'
import { now } from 'utils/now'
import { parseUnits } from 'utils/parseUnits'
import { useAuth, useBalances, useChain, useStaking } from 'hooks'
import { bnum } from 'utils/bnum'
import { BigNumber } from 'ethers'

export function useAddLiquidityETH(amountsIn: string[]) {
  const TIMESTAMP = now() + MINUTE * 3

  const { account, isConnected } = useAuth()
  const balanceOf = useBalances()
  const { chainId, nativeCurrency } = useChain()
  const {
    poolTokenAddresses,
    poolTokenDecimals,
    shouldReversePoolTokenOrderOnDisplay,
  } = useStaking()

  const ethIndex = shouldReversePoolTokenOrderOnDisplay ? 0 : 1
  const tokenIndex = 1 - ethIndex

  const maxAvailableAmountsIn = poolTokenAddresses.map((addr, i) =>
    i === ethIndex ? balanceOf(nativeCurrency.address) : balanceOf(addr)
  )

  const scaledAmountsIn = amountsIn.map((amt, i) =>
    parseUnits(amt, poolTokenDecimals[i]).toString()
  )

  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  const scaledMinAmountsIn = useMemo(
    () => scaledAmountsIn.map((amt) => calcSlippageAmount(amt, slippage)[0]),
    [scaledAmountsIn, slippage]
  )

  const args = [
    poolTokenAddresses[tokenIndex], // token
    scaledAmountsIn[tokenIndex], // amountTokenDesired
    scaledMinAmountsIn[tokenIndex], // amountTokenMin
    scaledMinAmountsIn[ethIndex], // amountETHMin
    account, // to
    `0x${TIMESTAMP.toString(16)}`, // deadline
  ]

  const enabled =
    !!isConnected &&
    scaledAmountsIn.some(
      (amt, i) => bnum(amt).gt(0) && bnum(amt).lte(maxAvailableAmountsIn[i])
    )

  const { config: _config } = usePrepareContractWrite({
    address: DEX_PROTOCOL_ADDRESS[chainId] as Hash,
    abi: PancakeRouterAbi as PayableAbi[],
    args,
    chainId,
    functionName: 'addLiquidityETH',
    enabled,
    overrides: {
      value: BigNumber.from(
        parseUnits(
          scaledAmountsIn[ethIndex],
          poolTokenDecimals[ethIndex]
        ).toString()
      ),
    },
  })

  const { writeAsync } = useContractWrite(_config)

  async function addLiquidityETH() {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }

  return writeAsync ? addLiquidityETH : undefined
}
