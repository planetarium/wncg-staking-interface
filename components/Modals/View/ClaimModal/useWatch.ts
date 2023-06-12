import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { claimTxAtom } from 'states/tx'

import { useFetchUserBalances, useFetchUserData } from 'hooks/queries'
import { useChain } from 'hooks'

export function useWatch(send: (event: string) => void) {
  const { chainId } = useChain()

  const tx = useAtomValue(claimTxAtom)
  const { refetch: refetchUserData } = useFetchUserData()
  const { refetch: refetchBalances } = useFetchUserBalances()

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    suspense: false,
    chainId,
    onSuccess() {
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useMount(() => {
    refetchUserData()
  })

  useUnmount(() => {
    refetchUserData()
    refetchBalances()
  })
}
