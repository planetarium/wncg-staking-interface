import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { cooldownTxAtom } from 'states/tx'
import { useChain, useRefetch } from 'hooks'

export function useWatch(send: (event: string) => void) {
  const { chainId } = useChain()
  const refetch = useRefetch({
    staking: true,
    userData: true,
  })

  const tx = useAtomValue(cooldownTxAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    suspense: false,
    chainId,
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
