import { useEffect, useState } from 'react'
import { useUnmount } from 'react-use'
import { toast } from 'react-toastify'
import { useWaitForTransaction } from 'wagmi'

import { useChain, useRefetch } from 'hooks'

export function useWatch(hash: Hash) {
  const [status, setStatus] = useState<null | 0 | 1>(null)

  const { chainId } = useChain()

  const refetch = useRefetch({
    staking: true,
    pool: true,
    poolSnapshot: true,
    userAllowances: true,
    userBalances: true,
    userData: true,
  })

  useWaitForTransaction({
    enabled: !!hash,
    hash,
    chainId,
    suspense: false,
    async onSuccess() {
      setStatus(1)
      await refetch()
    },
    onError() {
      setStatus(0)
    },
  })

  useEffect(() => {
    if (status != null) {
      toast.update(`toast:${hash}`, { autoClose: 5 * 1_000 })
    }
  }, [hash, status])

  useUnmount(() => {
    if (status == null) refetch()
  })

  return status
}
