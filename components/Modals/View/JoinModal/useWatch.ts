import { useUnmount } from 'react-use'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { joinTxAtom } from 'states/tx'
import { formatUnits } from 'utils/formatUnits'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { useClientMount, useChain, useRefetch, useStaking } from 'hooks'

export const receivedLpAmountAtom = atom('')

export function useWatch(send: XstateSend) {
  const { chainId } = useChain()
  const { lpToken } = useStaking()

  const refetch = useRefetch({
    userAllowances: true,
    userBalances: true,
    pool: true,
    userData: true,
  })

  const tx = useAtomValue(joinTxAtom)
  const setReceivedLpAmount = useSetAtom(receivedLpAmountAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId,
    suspense: false,
    async onSuccess(tx) {
      const parsedLogs = parseTransferLogs(tx.logs)
      const joinLog = parsedLogs?.[lpToken?.address]

      if (joinLog) {
        const lpAmount = formatUnits(joinLog, lpToken?.decimals)

        setReceivedLpAmount(lpAmount)
      }

      await refetch()
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
