import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { useContractWrite, usePrepareContractWrite, useQuery } from 'wagmi'

import { slippageAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { MINUTE } from 'config/misc'
import { prepareAddLiquidity } from 'lib/queries/bsc/prepareAddLiquidity'
import { bnum } from 'utils/bnum'
import { now } from 'utils/now'
import { useAuth, useChain, useSwitchNetwork } from 'hooks'
import { useAddLiquidityMath } from './useAddLiquidityMath'

export function useAddLiquidity(assets: Hash[], amountsIn: string[]) {
  const [error, setError] = useState<string | null>(null)
  const [deadline, setDeadline] = useState(
    `0x${(now() + 20 * MINUTE).toString(16)}`
  )

  const { account, isConnected } = useAuth()
  const { chainId, nativeCurrency, networkMismatch } = useChain()
  const { switchBeforeSend } = useSwitchNetwork()
  const hasNativeCurrency = assets.includes(nativeCurrency.address)
  const { maxBalances } = useAddLiquidityMath(hasNativeCurrency)

  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  const enabled =
    !networkMismatch &&
    !!isConnected &&
    amountsIn.every(
      (amt, i) => bnum(amt).gt(0) && bnum(amt).lte(maxBalances[i])
    )

  const { data } = useQuery(
    [
      QUERY_KEYS.Liquidity.AddLiquidity,
      chainId,
      account,
      ...assets,
      ...amountsIn,
      slippage,
      deadline,
    ],
    () =>
      prepareAddLiquidity(
        chainId,
        account!,
        assets,
        amountsIn,
        slippage,
        deadline
      ),
    {
      enabled,
      useErrorBoundary: false,
      onError(err: any) {
        if (
          err?.code?.includes('EXPIRED') ||
          err?.reason?.includes('EXPIRED')
        ) {
          setDeadline(`0x${(now() + 20 * MINUTE).toString(16)}`)
        }
      },
    }
  )

  const { config: _config } = usePrepareContractWrite({
    ...data,
    enabled: !!data,
    onError(err: any) {
      switchBeforeSend(err)

      if (
        err?.reason?.includes('TRANSFER_FROM_FAILED') ||
        err?.shortMessage?.includes('TRANSFER_FROM_FAILED')
      ) {
        setError('INSUFFICIENT_ALLOWANCE')
      }

      if (
        err?.reason?.includes('INSUFFICIENT_A_AMOUNT') ||
        err?.shortMessage?.includes('INSUFFICIENT_A_AMOUNT')
      ) {
        setError('INSUFFICIENT_A_AMOUNT')
      }

      if (
        err?.reason?.includes('INSUFFICIENT_B_AMOUNT') ||
        err?.shortMessage?.includes('INSUFFICIENT_B_AMOUNT')
      ) {
        setError('INSUFFICIENT_B_AMOUNT')
      }
    },
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

  return {
    addLiquidity,
    error,
  }
}
