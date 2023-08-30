import { useUnmount } from 'react-use'
import { atom, useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { stakeTxAtom } from 'states/tx'
import { useClientMount, useChain, useRefetch } from 'hooks'

export const stakingErrorAtom = atom<any>(null)

export function useWatch(send: XstateSend) {
  const { chainId } = useChain()
  const tx = useAtomValue(stakeTxAtom)

  const refetch = useRefetch({
    userAllowances: true,
    userBalances: true,
    userData: true,
    staking: true,
  })

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

  useClientMount(() => {
    refetch()
    return
  })

  useUnmount(() => {
    refetch()
    return
  })
}
