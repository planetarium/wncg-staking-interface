import { useMount, useUnmount } from 'react-use'
import { atom, useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { exitTxAtom } from 'states/tx'
import { wait } from 'utils/wait'
import { useChain, useRefetch } from 'hooks'
import { parseTransferLogs } from 'utils/parseTransferLogs'

export const exitAmountsAtom = atom<string[]>([])

export function useWatch(send: (event: string) => void) {
  const { chainId } = useChain()

  const refetch = useRefetch({
    userBalances: true,
    pool: true,
    userData: true,
  })

  const tx = useAtomValue(exitTxAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId,
    suspense: false,
    async onSuccess(tx) {
      await wait(100)
      // const transferLogs = parseTransferLogs(tx.logs)
      // console.log(transferLog)
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
