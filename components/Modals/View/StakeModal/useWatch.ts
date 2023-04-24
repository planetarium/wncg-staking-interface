import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { stakeTxAtom } from 'states/tx'
import config from 'config'
import {
  useFetchStaking,
  useFetchUserBalances,
  useFetchUserData,
} from 'hooks/queries'

export function useWatch(send: (event: string) => void) {
  const tx = useAtomValue(stakeTxAtom)

  const { refetch: refetchBalances } = useFetchUserBalances({
    suspense: false,
  })

  const { refetch: refetchUserData } = useFetchUserData({
    suspense: false,
  })

  const { refetch: refetchStaking } = useFetchStaking({
    suspense: false,
  })

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId: config.chainId,
    suspense: false,
    async onSuccess() {
      await refetchUserData()
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useMount(() => {
    refetchUserData()
    refetchBalances()
    refetchStaking()
  })

  useUnmount(() => {
    refetchUserData()
    refetchBalances()
    refetchStaking()
  })
}
