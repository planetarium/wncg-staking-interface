import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { joinTxAtom } from 'states/tx'
import config from 'config'
import { useFetchUserBalances } from 'hooks/queries'

export function useWatch(send: (event: string) => void) {
  const { refetch: refetchBalances } = useFetchUserBalances({
    suspense: false,
  })

  // const { refetch: refetchLpPoolBalances } = useFetchLpPoolBalances({
  //   suspense: false,
  // })

  const tx = useAtomValue(joinTxAtom)

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
