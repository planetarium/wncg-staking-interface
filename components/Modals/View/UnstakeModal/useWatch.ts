import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { unstakeTxAtom } from 'states/tx'
import {
  useFetchUserData,
  useFetchUserBalances,
  useFetchStaking,
} from 'hooks/queries'
import config from 'config'

export function useWatch(send: (event: string) => void) {
  const { refetch: refetchUserData } = useFetchUserData({
    suspense: false,
  })
  const { refetch: refetchBalances } = useFetchUserBalances({
    suspense: false,
  })

  // const { refetch: refetchLpPoolBalances } = useFetchLpPoolBalances({
  //   suspense: false,
  // })

  const { refetch: refetchStaking } = useFetchStaking({
    suspense: false,
  })

  const tx = useAtomValue(unstakeTxAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId: config.chainId,
    suspense: false,
    async onSuccess() {
      await refetchUserData()
      // await refetchLpPoolBalances()
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useMount(() => {
    refetchUserData()
    refetchBalances()
  })

  useUnmount(() => {
    refetchUserData()
    refetchBalances()
    // refetchLpPoolBalances()
    refetchStaking()
  })
}
