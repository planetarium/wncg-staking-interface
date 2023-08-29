import { useUnmount } from 'react-use'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { addLiquidityTxAtom } from 'states/tx'
import { formatUnits } from 'utils/formatUnits'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { useChain, useClientMount, useRefetch, useStaking } from 'hooks'

export const receivedLpAmountAtom = atom('')
export const addLiquidityErrorAtom = atom<any>(null)

export function useWatch(send: XstateSend) {
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
    return
  })

  useUnmount(() => {
    refetch()
    return
  })
}
