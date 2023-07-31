import { useUnmount } from 'react-use'
import { atom, useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { cooldownTxAtom } from 'states/tx'
import { useClientMount, useChain, useRefetch } from 'hooks'

export const cooldownTimestampAtom = atom(0)
export const unstakeTimestampAtom = atom(0)

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
    chainId,
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
