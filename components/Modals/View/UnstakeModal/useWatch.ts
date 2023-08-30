import { useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { unstakeTxAtom } from 'states/tx'
import { useClientMount, useChain, useRefetch } from 'hooks'

export function useWatch(send: XstateSend) {
  const { chainId } = useChain()

  const refetch = useRefetch({
    userAllowances: true,
    userData: true,
    userBalances: true,
    pool: true,
    staking: true,
  })

  const tx = useAtomValue(unstakeTxAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId,
    suspense: false,
    onSuccess() {
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useClientMount(() => {
    refetch()
    return
  })

  useUnmount(() => {
    refetch()
    return
  })
}
