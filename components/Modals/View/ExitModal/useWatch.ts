import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { exitTxAtom } from 'states/tx'
import { useFetchUserBalances } from 'hooks/queries'
import config from 'config'

export function useWatch(send: (event: string) => void) {
  const { refetch: refetchBalances } = useFetchUserBalances({
    suspense: false,
  })
  // const { refetch: refetchLpPoolBalances } = useFetchLpPoolBalances({
  //   suspense: false,
  // })

  const tx = useAtomValue(exitTxAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId: config.chainId,
    suspense: false,
    onSuccess() {
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useMount(() => {
    refetchBalances()
  })

  useUnmount(() => {
    refetchBalances()
    // refetchLpPoolBalances()
  })
}
