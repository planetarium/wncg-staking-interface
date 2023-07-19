import { useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { approveTxAtom } from 'states/tx'
import { useClientMount, useRefetch } from 'hooks'

export function useWatch(send: (event: string) => void) {
  const refetch = useRefetch({
    userAllowances: true,
  })

  const tx = useAtomValue(approveTxAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    suspense: false,
    async onSuccess() {
      await refetch()
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
