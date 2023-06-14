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

export function useAddLiquidity(amountsIn: string[]) {
  const TIMESTAMP = now() + MINUTE * 3

  const { account, isConnected } = useAuth()
  const balanceOf = useBalances()
  const { chainId } = useChain()
  const { poolTokenAddresses, poolTokenDecimals } = useStaking()
  const maxAvailableAmountsIn = poolTokenAddresses.map((addr) =>
    balanceOf(addr)
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
    ...poolTokenAddresses, // tokenA, tokenB
    ...scaledAmountsIn, // amountADesired, amountBDesired
    ...scaledMinAmountsIn, // amountAMin, amountBMin
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
    abi: PancakeRouterAbi as NonPayableAbi[],
    args,
    chainId,
    functionName: 'addLiquidity',
    enabled,
  })

  const { writeAsync } = useContractWrite(_config)

  async function addLiquidity() {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }

  return writeAsync ? addLiquidity : undefined
}
