import { useUnmount } from 'react-use'
import { atom, useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { exitTxAtom } from 'states/tx'
import { wait } from 'utils/wait'
import { useClientMount, useChain, useRefetch } from 'hooks'

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
    async onSuccess() {
      await wait(100)
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
