import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { addLiquidityAtom } from 'states/tx'
import { useChain, useRefetch } from 'hooks'

export function useWatch(send: (event: string) => void) {
  const { chainId } = useChain()
  const refetch = useRefetch({
    pool: true,
    userAllowances: true,
    userBalances: true,
    userData: true,
  })

  const tx = useAtomValue(addLiquidityAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId,
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
