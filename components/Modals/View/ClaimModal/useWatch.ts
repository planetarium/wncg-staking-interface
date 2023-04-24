import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { claimTxAtom } from 'states/tx'

import { useFetchUserBalances, useFetchUserData } from 'hooks/queries'
import config from 'config'

export function useWatch(send: (event: string) => void) {
  const tx = useAtomValue(claimTxAtom)
  const { refetch: refetchUserData } = useFetchUserData()
  const { refetch: refetchBalances } = useFetchUserBalances()

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    suspense: false,
    chainId: config.chainId,
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
