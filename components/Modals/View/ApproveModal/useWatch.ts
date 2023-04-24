import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { approveTxAtom } from 'states/tx'

import { useFetchUserAllowances } from 'hooks/queries'
import config from 'config'

export function useWatch(send: (event: string) => void) {
  const { refetch: refetchAllowances } = useFetchUserAllowances({
    suspense: false,
  })

  const tx = useAtomValue(approveTxAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId: config.chainId,
    suspense: false,
    async onSuccess() {
      await refetchAllowances()
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useMount(() => {
    refetchAllowances()
  })

  useUnmount(() => {
    refetchAllowances()
  })
}
