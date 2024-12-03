import { atom, useAtomValue } from 'jotai'
import { useUnmount } from 'react-use'
import { useWaitForTransaction } from 'wagmi'

import { useChain, useClientMount, useRefetch } from 'hooks'
import { exitTxAtom } from 'states/tx'

export const exitAmountsAtom = atom<string[]>([])

export function useWatch(send: XstateSend) {
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
    async onSuccess(_tx) {
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
