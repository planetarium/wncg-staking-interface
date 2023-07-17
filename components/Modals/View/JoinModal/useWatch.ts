import { useMount, useUnmount } from 'react-use'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { joinTxAtom } from 'states/tx'
import { formatUnits } from 'utils/formatUnits'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { useChain, useRefetch, useStaking } from 'hooks'

export const receivedLpAmountAtom = atom('')

export function useWatch(send: (event: string) => void) {
  const { chainId } = useChain()
  const { lpToken } = useStaking()

  const refetch = useRefetch({
    userBalances: true,
    pool: true,
    userData: true,
    userAllowances: true,
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
        const lpAmount = formatUnits(joinLog.args?.[2], lpToken?.decimals)
        setReceivedLpAmount(lpAmount)
      }

      await refetch()

      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useMount(() => {
    refetch()
  })

  useUnmount(() => {
    refetch()
  })
}
