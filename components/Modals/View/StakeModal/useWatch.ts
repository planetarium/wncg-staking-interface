import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { stakeTxAtom } from 'states/tx'
import config from 'config'
import { useRefetch } from 'hooks'

export function useWatch(send: (event: string) => void) {
  const tx = useAtomValue(stakeTxAtom)

  const refetch = useRefetch({
    userBalances: true,
    userData: true,
    staking: true,
  })

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId: config.chainId,
    suspense: false,
    async onSuccess() {
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
