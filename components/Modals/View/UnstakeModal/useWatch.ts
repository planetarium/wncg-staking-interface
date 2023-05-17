import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { unstakeTxAtom } from 'states/tx'
import config from 'config'
import { useRefetch } from 'hooks'

export function useWatch(send: (event: string) => void) {
  const refetch = useRefetch({
    userData: true,
    userBalances: true,
    pool: true,
    staking: true,
  })

  const tx = useAtomValue(unstakeTxAtom)

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
