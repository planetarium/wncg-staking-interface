import { useUnmount } from 'react-use'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { addLiquidityTxAtom } from 'states/tx'
import { useChain, useClientMount, useRefetch, useStaking } from 'hooks'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { formatUnits } from 'utils/formatUnits'

export const receivedLpAmountAtom = atom('')

export function useWatch(send: (event: string) => void) {
  const { chainId } = useChain()
  const { lpToken } = useStaking()

  const refetch = useRefetch({
    pool: true,
    userAllowances: true,
    userBalances: true,
    userData: true,
  })

  const tx = useAtomValue(addLiquidityTxAtom)
  const setReceivedLpAmount = useSetAtom(receivedLpAmountAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId,
    suspense: false,
    async onSuccess(tx) {
      await refetch()
      const parsedLogs = parseTransferLogs(tx.logs)
      const received = parsedLogs?.[lpToken?.address]

      if (received) {
        setReceivedLpAmount(formatUnits(received, lpToken?.decimals))
      }
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useClientMount(() => {
    refetch()
  })

  useUnmount(() => {
    refetch()
  })
}
