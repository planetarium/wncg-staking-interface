import { useCallback, useState } from 'react'
import { useContractWrite, usePrepareContractWrite, useQuery } from 'wagmi'
import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { prepareAddLiquidity } from 'lib/queries/bsc/prepareAddLiquidity'
import { bnum } from 'utils/bnum'
import { useAuth } from 'hooks/useAuth'
import { useChain } from 'hooks/useChain'
import { useStaking } from 'hooks/useStaking'
import { isBsc } from 'utils/isBsc'

export function useAddLiquidityConfig(assets: Hash[], joinAmounts: string[]) {
  const [zapError, setZapError] = useState<boolean | null>(null)

  const { account, isConnected } = useAuth()
  const { chainId } = useChain()
  const { lpToken } = useStaking()

  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  const enabled =
    isBsc(chainId) &&
    !!isConnected &&
    joinAmounts.every((amt) => bnum(amt).gt(0))

  const { data: addContract } = useQuery(
    [
      QUERY_KEYS.Liquidity.AddLiquidity,
      chainId,
      account,
      ...assets,
      ...joinAmounts,
      slippage,
    ],
    () => prepareAddLiquidity(chainId, account!, assets, joinAmounts, slippage),
    {
      enabled,
      useErrorBoundary: false,
    }
  )

  const { config: addConfig } = usePrepareContractWrite({
    ...addContract?.contract,
    overrides: addContract?.overrides,
    enabled: !!addContract,
  })

  const { writeAsync } = useContractWrite(addConfig as any)

  const addLiquidity = useCallback(async () => {
    try {
      if (!writeAsync) throw new Error()

      const res = await writeAsync?.()
      return res?.hash
    } catch (error: any) {
      if (
        error.code === 'ACTION_REJECTED' ||
        error.code === 4001 ||
        error.error === 'Rejected by user'
      ) {
        return
      }

      throw error
    }
  }, [writeAsync])

  return addLiquidity
}
