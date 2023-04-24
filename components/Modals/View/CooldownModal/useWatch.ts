import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { cooldownTxAtom } from 'states/tx'
import config from 'config'
import { useFetchStaking, useFetchUserData } from 'hooks/queries'

export function useWatch(send: (event: string) => void) {
  const { refetch: refetchStaking } = useFetchStaking({
    enabled: true,
    suspense: false,
  })
  const { refetch: refetchUserData } = useFetchUserData({
    suspense: false,
  })

  const tx = useAtomValue(cooldownTxAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    suspense: false,
    chainId: config.chainId,
    async onSuccess() {
      await refetchStaking()
      await refetchUserData()
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useMount(() => {
    refetchStaking()
    refetchUserData()
  })

  useUnmount(() => {
    refetchStaking()
    refetchUserData()
  })
}
