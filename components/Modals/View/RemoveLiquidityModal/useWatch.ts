import { useUnmount } from 'react-use'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { removeLiquidityTxAtom } from 'states/tx'
import { formatUnits } from 'utils/formatUnits'
import { parseLog } from 'utils/parseLog'
import { useClientMount, useChain, useRefetch, useStaking } from 'hooks'

export const actualAmountsOutAtom = atom(['0', '0'])

export function useWatch(send: XstateSend) {
  const { chainId } = useChain()
  const { poolTokenDecimals } = useStaking()

  const refetch = useRefetch({
    userAllowances: true,
    userBalances: true,
    pool: true,
  })

  const tx = useAtomValue(removeLiquidityTxAtom)
  const setActualAmountsOut = useSetAtom(actualAmountsOutAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId,
    suspense: false,
    async onSuccess(tx) {
      await refetch()

      const parsedLogs = tx.logs.map((l) => parseLog(l))
      const burnLog = parsedLogs.find((l) => l?.name === 'Burn')

      if (burnLog?.args) {
        const actualAmountsOut = [burnLog?.args[1], burnLog?.args[2]].map(
          (arg, i) => formatUnits(arg, poolTokenDecimals[i])
        )

        setActualAmountsOut(actualAmountsOut)
      }

      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useClientMount(() => {
    refetch()
    return
  })

  useUnmount(() => {
    refetch()
    return
  })
}
